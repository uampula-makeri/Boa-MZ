import { GameStatus, Player, RuleProfile } from './types';
import { getPlayerPits } from './boardMapping';

export interface GameOverCheckResult {
  isOver: boolean;
  status: GameStatus;
  winner: Player | 'draw' | null;
  reason?: string;
}

/**
 * Avalia se a partida terminou segundo as condições configuradas
 */
export function checkGameOver(
  board: Record<string, number>,
  nextPlayer: Player,
  hasLegalMoves: boolean,
  turnCount: number,
  profile: RuleProfile
): GameOverCheckResult {
  const pitsA = getPlayerPits('A');
  const pitsB = getPlayerPits('B');

  const totalA = pitsA.reduce((sum, p) => sum + (board[p.id] || 0), 0);
  const totalB = pitsB.reduce((sum, p) => sum + (board[p.id] || 0), 0);

  // 1. Eliminação total
  if (profile.winByElimination) {
    if (totalB === 0 && totalA > 0) {
      return {
        isOver: true,
        status: 'won_A',
        winner: 'A',
        reason: 'O Jogador A eliminou todas as sementes do Jogador B.',
      };
    }
    if (totalA === 0 && totalB > 0) {
      return {
        isOver: true,
        status: 'won_B',
        winner: 'B',
        reason: 'O Jogador B eliminou todas as sementes do Jogador A.',
      };
    }
    if (totalA === 0 && totalB === 0) {
      return {
        isOver: true,
        status: 'draw',
        winner: 'draw',
        reason: 'Ambos os jogadores ficaram sem peças.',
      };
    }
  }

  // 2. Sem jogadas legais para o jogador do turno actual
  if (!hasLegalMoves && profile.winByNoLegalMoves) {
    const winner: Player = nextPlayer === 'A' ? 'B' : 'A';
    return {
      isOver: true,
      status: winner === 'A' ? 'won_A' : 'won_B',
      winner,
      reason: `O Jogador ${nextPlayer} não tem jogadas legais disponíveis. Vitória do Jogador ${winner}.`,
    };
  }

  // 3. Limite de turnos
  if (profile.maxTurnLimit > 0 && turnCount >= profile.maxTurnLimit) {
    if (totalA > totalB) {
      return {
        isOver: true,
        status: 'won_A',
        winner: 'A',
        reason: `Limite de ${profile.maxTurnLimit} turnos atingido. Vitória de A por vantagem de sementes (${totalA} vs ${totalB}).`,
      };
    } else if (totalB > totalA) {
      return {
        isOver: true,
        status: 'won_B',
        winner: 'B',
        reason: `Limite de ${profile.maxTurnLimit} turnos atingido. Vitória de B por vantagem de sementes (${totalB} vs ${totalA}).`,
      };
    } else {
      return {
        isOver: true,
        status: 'draw',
        winner: 'draw',
        reason: `Limite de ${profile.maxTurnLimit} turnos atingido com igualdade de sementes (${totalA}). Empate.`,
      };
    }
  }

  return {
    isOver: false,
    status: 'in_progress',
    winner: null,
  };
}
