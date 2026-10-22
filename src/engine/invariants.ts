import { GameState, Player } from './types';
import { PITS } from './boardMapping';

export interface AuditResult {
  valid: boolean;
  totalSeedsOnBoard: number;
  totalCapturedA: number;
  totalCapturedB: number;
  totalSystemSeeds: number;
  expectedTotalSeeds: number;
  errors: string[];
}

/**
 * Realiza uma auditoria estrita a todas as invariantes lógicas do jogo
 */
export function auditInvariants(state: GameState): AuditResult {
  const errors: string[] = [];
  const expectedTotalSeeds = 32 * state.config.profile.initialSeedsPerPit;
  
  // 1. Contagem de casas no tabuleiro
  const pitKeys = Object.keys(state.board);
  if (pitKeys.length !== 32) {
    errors.push(`Invariante violada: O tabuleiro deve ter exactamente 32 casas, mas tem ${pitKeys.length}.`);
  }
  
  // 2. Não negatividade e integridade dos orifícios
  let totalOnBoard = 0;
  for (const [pitId, count] of Object.entries(state.board)) {
    if (!PITS[pitId]) {
      errors.push(`Invariante violada: Identificador de casa desconhecido: ${pitId}`);
    }
    if (typeof count !== 'number' || !Number.isInteger(count) || count < 0) {
      errors.push(`Invariante violada: A casa ${pitId} contém um valor inválido de sementes (${count}).`);
    } else {
      totalOnBoard += count;
    }
  }
  
  // 3. Conservação de sementes: Board + Captured A + Captured B == expectedTotalSeeds
  const totalSystemSeeds = totalOnBoard + state.capturedA + state.capturedB;
  if (totalSystemSeeds !== expectedTotalSeeds) {
    errors.push(
      `Invariante de Conservação violada! Total actual: ${totalSystemSeeds} (Tabuleiro: ${totalOnBoard}, Capturadas por A: ${state.capturedA}, Capturadas por B: ${state.capturedB}), Esperado: ${expectedTotalSeeds}`
    );
  }
  
  // 4. Jogador activo válido
  if (state.currentPlayer !== 'A' && state.currentPlayer !== 'B') {
    errors.push(`Invariante violada: Jogador actual inválido: ${state.currentPlayer}`);
  }
  
  // 5. Estado do jogo consistente
  if (state.status !== 'in_progress') {
    if (state.status === 'won_A' && state.winner !== 'A') {
      errors.push(`Invariante violada: Estado 'won_A' mas vencedor não é A.`);
    }
    if (state.status === 'won_B' && state.winner !== 'B') {
      errors.push(`Invariante violada: Estado 'won_B' mas vencedor não é B.`);
    }
    if (state.status === 'draw' && state.winner !== 'draw') {
      errors.push(`Invariante violada: Estado 'draw' mas vencedor não é 'draw'.`);
    }
  }
  
  return {
    valid: errors.length === 0,
    totalSeedsOnBoard: totalOnBoard,
    totalCapturedA: state.capturedA,
    totalCapturedB: state.capturedB,
    totalSystemSeeds,
    expectedTotalSeeds,
    errors,
  };
}
