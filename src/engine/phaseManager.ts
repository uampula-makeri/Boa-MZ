import { GamePhase, Player, RuleProfile } from './types';
import { getPlayerPits } from './boardMapping';

/**
 * Verifica se um jogador ou o jogo deve transitar para a Fase 2 (Peças Individuais)
 */
export function checkPhaseTransition(
  board: Record<string, number>,
  player: Player,
  currentPhase: GamePhase,
  profile: RuleProfile
): { newPhase: GamePhase; changed: boolean; reason?: string } {
  if (!profile.autoPhase2Transition) {
    return { newPhase: currentPhase, changed: false };
  }

  // Verificar se o jogador activo tem alguma casa com >= 2 sementes
  const playerPits = getPlayerPits(player);
  const hasGroups = playerPits.some(p => (board[p.id] || 0) >= 2);

  if (hasGroups) {
    return {
      newPhase: 'phase1_groups',
      changed: currentPhase !== 'phase1_groups',
      reason: currentPhase !== 'phase1_groups' ? `Jogador ${player} possui grupos (≥ 2 sementes).` : undefined,
    };
  }

  const totalSeeds = playerPits.reduce((acc, p) => acc + (board[p.id] || 0), 0);
  if (totalSeeds > 0) {
    return {
      newPhase: 'phase2_singles',
      changed: currentPhase !== 'phase2_singles',
      reason: `Jogador ${player} esgotou todas as covas com mais de uma semente (apenas peças isoladas).`,
    };
  }

  return { newPhase: currentPhase, changed: false };
}

/**
 * Determina se uma casa com semente única pode ser movida pelo jogador
 */
export function canMoveSingleSeed(
  board: Record<string, number>,
  player: Player,
  currentPhase: GamePhase,
  profile: RuleProfile
): boolean {
  const playerPits = getPlayerPits(player);
  const hasGroups = playerPits.some(p => (board[p.id] || 0) >= 2);
  // Regra fundamental: NUNCA se pode mover semente única enquanto houver covas com >= 2 sementes
  if (hasGroups) {
    return false;
  }
  return profile.allowSingleSeedWhenNoGroups || currentPhase === 'phase2_singles';
}
