import { GameState, AIDifficulty, Player } from '../engine/types';
import { getLegalMoves } from '../engine/moveGenerator';
import { executeSowing } from '../engine/sowing';
import { evaluatePosition } from './evaluation';
import { minimaxAlphaBeta } from './search';

export interface AIMoveDecision {
  pitId: string;
  difficulty: AIDifficulty;
  reason: string;
  nodesEvaluated?: number;
  expectedCaptures?: number;
}

/**
 * Seleciona a melhor jogada para a Inteligência Artificial conforme a dificuldade configurada
 */
export function selectAIMove(state: GameState): AIMoveDecision | null {
  const me = state.currentPlayer;
  const opp: Player = me === 'A' ? 'B' : 'A';
  const phase = state.phase;
  const profile = state.config.profile;
  const difficulty = state.config.aiDifficulty;

  const legalMoves = getLegalMoves(state.board, me, phase, profile);
  if (legalMoves.length === 0) {
    return null;
  }

  // Se houver apenas uma jogada legal, joga-a imediatamente
  if (legalMoves.length === 1) {
    return {
      pitId: legalMoves[0].pitId,
      difficulty,
      reason: 'Única jogada legal disponível.',
      expectedCaptures: legalMoves[0].expectedCaptures,
    };
  }

  // 1. DIFICULDADE FÁCIL:
  // Escolha aleatória com leve preferência por movimentos com captura
  if (difficulty === 'easy') {
    const captureMoves = legalMoves.filter(m => m.isCapture);
    let chosen = legalMoves[Math.floor(Math.random() * legalMoves.length)];

    // 40% de chance de preferir uma captura se existir
    if (captureMoves.length > 0 && Math.random() < 0.4) {
      chosen = captureMoves[Math.floor(Math.random() * captureMoves.length)];
    }

    return {
      pitId: chosen.pitId,
      difficulty: 'easy',
      reason: chosen.isCapture ? 'Jogada com captura escolhida casualmente.' : 'Movimento exploratório casual.',
      expectedCaptures: chosen.expectedCaptures,
    };
  }

  // 2. DIFICULDADE MÉDIA:
  // Avaliação heurística a 1 nível (profundidade 1 com avaliação pós-semeadura)
  if (difficulty === 'medium') {
    let bestScore = -Infinity;
    let bestMove = legalMoves[0];

    for (const move of legalMoves) {
      const sim = executeSowing(state.board, move.pitId, me, phase, profile);
      const newCapturedMe = (me === 'A' ? state.capturedA : state.capturedB) + sim.capturedCount;
      const newCapturedOpp = me === 'A' ? state.capturedB : state.capturedA;

      const score = evaluatePosition(sim.boardAfter, newCapturedMe, newCapturedOpp, me, phase, profile);

      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }

    return {
      pitId: bestMove.pitId,
      difficulty: 'medium',
      reason: bestMove.isCapture
        ? `Jogada tática avaliada com captura prevista de ${bestMove.expectedCaptures} semente(s).`
        : 'Jogada posicional para equilíbrio de sementes.',
      expectedCaptures: bestMove.expectedCaptures,
    };
  }

  // 3. DIFICULDADE DIFÍCIL:
  // Pesquisa Minimax com Poda Alfa-Beta (profundidade 3)
  const capturedMe = me === 'A' ? state.capturedA : state.capturedB;
  const capturedOpp = me === 'A' ? state.capturedB : state.capturedA;

  const search = minimaxAlphaBeta(
    state.board,
    capturedMe,
    capturedOpp,
    3,
    -Infinity,
    Infinity,
    true,
    me,
    phase,
    profile
  );

  const selectedPitId = search.bestPitId || legalMoves[0].pitId;
  const chosenMoveInfo = legalMoves.find(m => m.pitId === selectedPitId);

  return {
    pitId: selectedPitId,
    difficulty: 'hard',
    reason: `Minimax Alfa-Beta (profundidade 3, ${search.nodes} nós avaliados).`,
    nodesEvaluated: search.nodes,
    expectedCaptures: chosenMoveInfo?.expectedCaptures || 0,
  };
}
