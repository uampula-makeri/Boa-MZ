import {
  GameState,
  GameConfig,
  Player,
  MoveResult,
  MoveRecord,
  RuleProfile,
} from './types';
import { PITS } from './boardMapping';
import { executeSowing } from './sowing';
import { getLegalMoves, validateMove } from './moveGenerator';
import { checkPhaseTransition } from './phaseManager';
import { checkGameOver } from './victory';
import { auditInvariants } from './invariants';
import { DEFAULT_RULE_PROFILE } from '../rules/ruleProfile';

/**
 * Cria o estado inicial padrão ou customizado do jogo BOA-MZ
 */
export function createInitialState(customConfig?: Partial<GameConfig>): GameState {
  const profile: RuleProfile = customConfig?.profile || DEFAULT_RULE_PROFILE;
  
  const config: GameConfig = {
    mode: 'pvp',
    aiDifficulty: 'medium',
    aiPlayer: 'B',
    profile,
    animationSpeed: 'normal',
    soundEnabled: true,
    showHints: true,
    showCoordinates: true,
    ...customConfig,
  };

  const board: Record<string, number> = {};
  for (const pitId of Object.keys(PITS)) {
    board[pitId] = config.profile.initialSeedsPerPit;
  }

  const startingPlayer: Player = 'A';

  const initialState: GameState = {
    board,
    currentPlayer: startingPlayer,
    startingPlayer,
    phase: 'phase1_groups',
    capturedA: 0,
    capturedB: 0,
    status: 'in_progress',
    winner: null,
    turnCount: 1,
    config,
    history: [],
    historyStates: [{
      board: { ...board },
      capturedA: 0,
      capturedB: 0,
      player: startingPlayer,
      phase: 'phase1_groups',
    }],
    lastMoveResult: null,
    invariantAudit: {
      valid: true,
      totalSeeds: 32 * config.profile.initialSeedsPerPit,
      expectedSeeds: 32 * config.profile.initialSeedsPerPit,
      message: 'Partida inicializada com integridade verificada.',
    },
  };

  const audit = auditInvariants(initialState);
  initialState.invariantAudit = {
    valid: audit.valid,
    totalSeeds: audit.totalSystemSeeds,
    expectedSeeds: audit.expectedTotalSeeds,
    message: audit.valid ? 'Invariantes conservadas (64 sementes no total).' : audit.errors.join('; '),
  };

  return initialState;
}

/**
 * Gera um hash determinístico do estado do tabuleiro para histórico e comparações
 */
export function getStateHash(board: Record<string, number>, player: Player): string {
  const sortedKeys = Object.keys(board).sort();
  const values = sortedKeys.map(k => `${k}:${board[k]}`).join(',');
  return `${player}|${values}`;
}

/**
 * Executa uma jogada no estado do jogo respeitando todas as regras transacionais
 */
export function executeMove(currentState: GameState, originPitId: string): { state: GameState; result: MoveResult } {
  // 1. Validar se o jogo já terminou
  if (currentState.status !== 'in_progress') {
    const errorResult: MoveResult = {
      valid: false,
      reason: 'A partida já foi concluída.',
      player: currentState.currentPlayer,
      originPitId,
      steps: [],
      sowedPits: [],
      capturedCount: 0,
      capturedPitIds: [],
      nextPlayer: currentState.currentPlayer,
      nextPhase: currentState.phase,
      gameOver: true,
      winner: currentState.winner,
      boardAfter: currentState.board,
      capturedAAfter: currentState.capturedA,
      capturedBAfter: currentState.capturedB,
      stateHash: getStateHash(currentState.board, currentState.currentPlayer),
    };
    return { state: currentState, result: errorResult };
  }

  const player = currentState.currentPlayer;
  const phase = currentState.phase;
  const profile = currentState.config.profile;

  // 2. Validar a jogada
  const validation = validateMove(currentState.board, originPitId, player, phase, profile);
  if (!validation.valid) {
    const errorResult: MoveResult = {
      valid: false,
      reason: validation.reason,
      player,
      originPitId,
      steps: [],
      sowedPits: [],
      capturedCount: 0,
      capturedPitIds: [],
      nextPlayer: player,
      nextPhase: phase,
      gameOver: false,
      winner: null,
      boardAfter: currentState.board,
      capturedAAfter: currentState.capturedA,
      capturedBAfter: currentState.capturedB,
      stateHash: getStateHash(currentState.board, player),
    };
    return { state: currentState, result: errorResult };
  }

  // 3. Executar a semeadura
  const sowingResult = executeSowing(currentState.board, originPitId, player, phase, profile);

  // 4. Actualizar contadores de capturas
  let newCapturedA = currentState.capturedA;
  let newCapturedB = currentState.capturedB;
  if (player === 'A') {
    newCapturedA += sowingResult.capturedCount;
  } else {
    newCapturedB += sowingResult.capturedCount;
  }

  // 5. Determinar próximo jogador
  const nextPlayer: Player = player === 'A' ? 'B' : 'A';

  // 6. Verificar transição de fase para o próximo jogador
  const phaseCheck = checkPhaseTransition(sowingResult.boardAfter, nextPlayer, phase, profile);
  const nextPhase = phaseCheck.newPhase;

  // 7. Obter jogadas legais do próximo jogador e avaliar fim de jogo
  const nextLegalMoves = getLegalMoves(sowingResult.boardAfter, nextPlayer, nextPhase, profile);
  const gameOverResult = checkGameOver(
    sowingResult.boardAfter,
    nextPlayer,
    nextLegalMoves.length > 0,
    currentState.turnCount + 1,
    profile
  );

  const stateHash = getStateHash(sowingResult.boardAfter, nextPlayer);

  const moveResult: MoveResult = {
    valid: true,
    player,
    originPitId,
    steps: sowingResult.steps,
    sowedPits: sowingResult.sowedPits,
    capturedCount: sowingResult.capturedCount,
    capturedPitIds: sowingResult.capturedPitIds,
    nextPlayer,
    nextPhase,
    gameOver: gameOverResult.isOver,
    winner: gameOverResult.winner,
    boardAfter: sowingResult.boardAfter,
    capturedAAfter: newCapturedA,
    capturedBAfter: newCapturedB,
    stateHash,
  };

  // 8. Criar registo de histórico
  const summary = sowingResult.capturedCount > 0
    ? `Turno ${currentState.turnCount} (${player}): jogou de ${originPitId}, capturou ${sowingResult.capturedCount} semente(s) em [${sowingResult.capturedPitIds.join(', ')}].`
    : `Turno ${currentState.turnCount} (${player}): jogou de ${originPitId}, distribuiu por ${sowingResult.sowedPits.length} casas sem capturas.`;

  const record: MoveRecord = {
    turnNumber: currentState.turnCount,
    player,
    originPitId,
    sowedPits: sowingResult.sowedPits,
    capturedCount: sowingResult.capturedCount,
    capturedPitIds: sowingResult.capturedPitIds,
    phaseBefore: phase,
    phaseAfter: nextPhase,
    summary,
    timestamp: Date.now(),
  };

  // 9. Compor novo estado seguro
  const nextState: GameState = {
    ...currentState,
    board: sowingResult.boardAfter,
    currentPlayer: gameOverResult.isOver ? player : nextPlayer,
    phase: nextPhase,
    capturedA: newCapturedA,
    capturedB: newCapturedB,
    status: gameOverResult.status,
    winner: gameOverResult.winner,
    turnCount: currentState.turnCount + 1,
    history: [...currentState.history, record],
    historyStates: [
      ...currentState.historyStates,
      {
        board: { ...sowingResult.boardAfter },
        capturedA: newCapturedA,
        capturedB: newCapturedB,
        player: nextPlayer,
        phase: nextPhase,
      },
    ],
    lastMoveResult: moveResult,
    invariantAudit: {
      valid: true,
      totalSeeds: 0,
      expectedSeeds: 32 * profile.initialSeedsPerPit,
      message: '',
    },
  };

  // 10. Auditoria de invariantes obrigatória após cada jogada
  const audit = auditInvariants(nextState);
  nextState.invariantAudit = {
    valid: audit.valid,
    totalSeeds: audit.totalSystemSeeds,
    expectedSeeds: audit.expectedTotalSeeds,
    message: audit.valid
      ? `Audit OK: ${audit.totalSeedsOnBoard} no tabuleiro, ${audit.totalCapturedA} de A, ${audit.totalCapturedB} de B. Total: ${audit.totalSystemSeeds} conservadas.`
      : audit.errors.join(' | '),
  };

  if (!audit.valid) {
    console.error('ALERTA: Invariante violada!', audit.errors);
  }

  return { state: nextState, result: moveResult };
}

/**
 * Desfaz a última jogada com garantia de conservação
 */
export function undoMove(currentState: GameState): GameState {
  if (currentState.historyStates.length <= 1) {
    return currentState;
  }

  const newHistoryStates = currentState.historyStates.slice(0, -1);
  const previousStateSnapshot = newHistoryStates[newHistoryStates.length - 1];
  const newHistory = currentState.history.slice(0, -1);

  const restoredState: GameState = {
    ...currentState,
    board: { ...previousStateSnapshot.board },
    capturedA: previousStateSnapshot.capturedA,
    capturedB: previousStateSnapshot.capturedB,
    currentPlayer: previousStateSnapshot.player,
    phase: previousStateSnapshot.phase,
    status: 'in_progress',
    winner: null,
    turnCount: Math.max(1, currentState.turnCount - 1),
    history: newHistory,
    historyStates: newHistoryStates,
    lastMoveResult: null,
  };

  const audit = auditInvariants(restoredState);
  restoredState.invariantAudit = {
    valid: audit.valid,
    totalSeeds: audit.totalSystemSeeds,
    expectedSeeds: audit.expectedTotalSeeds,
    message: audit.valid ? 'Jogada desfeita com sucesso.' : audit.errors.join(' | '),
  };

  return restoredState;
}
