import { Player, GamePhase, RuleProfile } from './types';
import { getPlayerPits, PITS } from './boardMapping';
import { executeSowing } from './sowing';

export interface LegalMoveInfo {
  pitId: string;
  seeds: number;
  expectedCaptures: number;
  capturedPitIds: string[];
  isCapture: boolean;
  landingPitId: string;
  sowedPitsCount: number;
}

/**
 * Retorna a lista de jogadas legais para o jogador actual
 */
export function getLegalMoves(
  board: Record<string, number>,
  player: Player,
  phase: GamePhase,
  profile: RuleProfile
): LegalMoveInfo[] {
  const playerPits = getPlayerPits(player);
  
  // 1. Filtrar casas com sementes
  const pitsWithSeeds = playerPits.filter(p => (board[p.id] || 0) > 0);
  if (pitsWithSeeds.length === 0) {
    return [];
  }

  // 2. Verificar grupos (casas com >= 2 sementes)
  const groupPits = pitsWithSeeds.filter(p => (board[p.id] || 0) >= 2);

  let candidatePits: typeof pitsWithSeeds = [];

  // REGRA FUNDAMENTAL E EQUITATIVA (Válida para o Jogador A e para o Computador/Jogador B):
  // Não é permitido jogar de uma cova com 1 semente antes de acabar as covas com mais de uma semente (>= 2).
  // Apenas quando esgotarem todas as covas com >= 2 sementes (groupPits.length === 0)
  // é que as covas com 1 semente se tornam jogáveis!
  if (groupPits.length > 0) {
    candidatePits = groupPits;
  } else if (profile.allowSingleSeedWhenNoGroups || phase === 'phase2_singles') {
    candidatePits = pitsWithSeeds;
  } else {
    return [];
  }

  // 3. Avaliar simulação preliminar para cada casa candidata
  const evaluatedMoves: LegalMoveInfo[] = candidatePits.map(pit => {
    const simulation = executeSowing(board, pit.id, player, phase, profile);
    return {
      pitId: pit.id,
      seeds: board[pit.id] || 0,
      expectedCaptures: simulation.capturedCount,
      capturedPitIds: simulation.capturedPitIds,
      isCapture: simulation.capturedCount > 0,
      landingPitId: simulation.lastLandingPitId,
      sowedPitsCount: simulation.sowedPits.length,
    };
  });

  // 4. Se a variante exigir captura obrigatória, filtrar caso haja capturas disponíveis
  if (profile.mandatoryCapture) {
    const captureMoves = evaluatedMoves.filter(m => m.isCapture);
    if (captureMoves.length > 0) {
      return captureMoves;
    }
  }

  return evaluatedMoves;
}

/**
 * Valida se uma jogada é permitida
 */
export function validateMove(
  board: Record<string, number>,
  originPitId: string,
  player: Player,
  phase: GamePhase,
  profile: RuleProfile
): { valid: boolean; reason?: string } {
  const pit = PITS[originPitId];
  if (!pit) {
    return { valid: false, reason: `Casa desconhecida: ${originPitId}` };
  }

  if (pit.player !== player) {
    return { valid: false, reason: `A casa ${originPitId} pertence ao adversário.` };
  }

  const seeds = board[originPitId] || 0;
  if (seeds === 0) {
    return { valid: false, reason: `A casa ${originPitId} está vazia.` };
  }

  // Validação explícita da regra: não jogar de cova de 1 semente antes de acabar covas com > 1
  const playerPits = getPlayerPits(player);
  const groupPits = playerPits.filter(p => (board[p.id] || 0) >= 2);
  if (seeds === 1 && groupPits.length > 0) {
    return {
      valid: false,
      reason: 'Não é permitido jogar de uma cova com 1 semente antes de acabar as covas com mais de uma semente.',
    };
  }

  const legalMoves = getLegalMoves(board, player, phase, profile);
  const isLegal = legalMoves.some(m => m.pitId === originPitId);

  if (!isLegal) {
    if (profile.mandatoryCapture && legalMoves.some(m => m.isCapture)) {
      return { valid: false, reason: 'Captura obrigatória activada: deve escolher uma jogada que capture sementes.' };
    }
    return { valid: false, reason: `Jogada ilegal a partir da casa ${originPitId}.` };
  }

  return { valid: true };
}
