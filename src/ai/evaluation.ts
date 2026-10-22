import { Player, RuleProfile, GamePhase } from '../engine/types';
import { getPlayerPits, getPlayerAttackPits, getPlayerDefensePits } from '../engine/boardMapping';
import { getLegalMoves } from '../engine/moveGenerator';

export interface EvaluationWeights {
  capturedDiff: number;
  boardSeedsDiff: number;
  mobilityDiff: number;
  defenseReserveRatio: number;
  threatenedVulnerability: number;
}

const DEFAULT_WEIGHTS: EvaluationWeights = {
  capturedDiff: 100,
  boardSeedsDiff: 50,
  mobilityDiff: 15,
  defenseReserveRatio: 12,
  threatenedVulnerability: -25,
};

/**
 * Função de avaliação heurística de uma posição para o jogador avaliado
 * Pontuação positiva = vantagem para o jogador analisado
 */
export function evaluatePosition(
  board: Record<string, number>,
  capturedMe: number,
  capturedOpp: number,
  me: Player,
  phase: GamePhase,
  profile: RuleProfile,
  weights: EvaluationWeights = DEFAULT_WEIGHTS
): number {
  const opp: Player = me === 'A' ? 'B' : 'A';

  const myPits = getPlayerPits(me);
  const oppPits = getPlayerPits(opp);

  const myTotalSeeds = myPits.reduce((acc, p) => acc + (board[p.id] || 0), 0);
  const oppTotalSeeds = oppPits.reduce((acc, p) => acc + (board[p.id] || 0), 0);

  // Se o adversário não tem peças, vitória garantida
  if (oppTotalSeeds === 0) return 100000;
  if (myTotalSeeds === 0) return -100000;

  // 1. Diferença de capturas
  const captureAdvantage = (capturedMe - capturedOpp) * weights.capturedDiff;

  // 2. Diferença de sementes vivas no tabuleiro
  const boardAdvantage = (myTotalSeeds - oppTotalSeeds) * weights.boardSeedsDiff;

  // 3. Mobilidade e casas ativas
  const myLegalMoves = getLegalMoves(board, me, phase, profile);
  const oppLegalMoves = getLegalMoves(board, opp, phase, profile);
  const mobilityAdvantage = (myLegalMoves.length - oppLegalMoves.length) * weights.mobilityDiff;

  // 4. Reserva defensiva (sementes seguras na fila exterior de defesa)
  const myDefensePits = getPlayerDefensePits(me);
  const myDefenseSeeds = myDefensePits.reduce((acc, p) => acc + (board[p.id] || 0), 0);
  const defenseBonus = myDefenseSeeds * weights.defenseReserveRatio;

  // 5. Risco de vulnerabilidade imediata da linha de ataque
  const myAttackPits = getPlayerAttackPits(me);
  let vulnerabilityPenalty = 0;
  for (const pit of myAttackPits) {
    const seeds = board[pit.id] || 0;
    // Se temos sementes na linha de ataque expostas a captura pelo oponente
    if (seeds > 0) {
      vulnerabilityPenalty += seeds * weights.threatenedVulnerability;
    }
  }

  return captureAdvantage + boardAdvantage + mobilityAdvantage + defenseBonus + vulnerabilityPenalty;
}
