/**
 * BOA-MZ: Jogo do Ntxuva do Sul de Moçambique
 * Tipos e Definições de Domínio do Motor Lógico
 */

export type Player = 'A' | 'B';

export type PitType = 'attack' | 'defense';

export interface PitDefinition {
  id: string; // e.g., 'A0' to 'A15', 'B0' to 'B15'
  player: Player;
  row: number; // 0: B-Defense, 1: B-Attack, 2: A-Attack, 3: A-Defense
  col: number; // 0 to 7
  type: PitType;
  trackIndex: number; // 0 to 15 along player's counter-clockwise circuit
}

export type GamePhase = 'phase1_groups' | 'phase2_singles';

export type GameStatus = 'in_progress' | 'won_A' | 'won_B' | 'draw';

export type AIDifficulty = 'easy' | 'medium' | 'hard';

export type GameMode = 'pvp' | 'ai';

export interface RuleProfile {
  id: string;
  name: string;
  variantSubtitle: string;
  version: string;
  culturalStatus: 'experimental' | 'provisional' | 'validated';
  cols: number; // default 8
  initialSeedsPerPit: number; // default 2
  
  // Regras de Semeadura e Continuação
  relayIfOccupied: boolean; // Se a última semente cai em casa com peças, recolhe e continua semeando
  maxRelayIterations: number; // Evitar loops infinitos (prevenção cíclica)
  
  // Regras de Casas Vazias
  emptyDefenseEndsTurn: boolean; // Última peça em casa de defesa vazia finaliza a jogada
  emptyAttackTriggersCapture: boolean; // Última peça em casa de ataque vazia verifica captura
  
  // Regras de Captura
  captureScope: 'attack_and_defense' | 'attack_only'; // Captura frente e trás, ou só ataque
  captureRequiresAttackOccupied: boolean; // Requer que a casa de ataque do adversário tenha >= 1 sementes
  mandatoryCapture: boolean; // Se verdadeiro, jogador é obrigado a escolher jogada com captura
  relayAfterCapture: boolean; // Se verdadeiro, jogador recolhe peças capturadas e continua; se falso, captura encerra a jogada
  
  // Fase de Peças Individuais
  allowSingleSeedWhenNoGroups: boolean; // Na fase 1, se não houver casas com >1 sementes, pode mover de 1
  autoPhase2Transition: boolean; // Transita para fase 2 quando todas as casas do jogador têm <= 1 semente
  singleSeedStepDistance: number; // Movimento de peças individuais (1 casa)
  
  // Condições de Vitória
  winByElimination: boolean; // Vitória por eliminação de todas as peças do adversário
  winByNoLegalMoves: boolean; // Vitória quando o adversário não tem jogadas legais
  maxTurnLimit: number; // 0 = desativado, ou limite de turnos para empate
}

export interface MoveStep {
  type: 'pickup' | 'sow' | 'relay_pickup' | 'capture' | 'turn_end';
  pitId: string;
  seedsDelta: number;
  seedsNow: number;
  seedsInHand: number;
  player: Player;
  note: string;
}

export interface MoveResult {
  valid: boolean;
  reason?: string;
  player: Player;
  originPitId: string;
  steps: MoveStep[];
  sowedPits: string[];
  capturedCount: number;
  capturedPitIds: string[];
  nextPlayer: Player;
  nextPhase: GamePhase;
  gameOver: boolean;
  winner: Player | 'draw' | null;
  boardAfter: Record<string, number>;
  capturedAAfter: number;
  capturedBAfter: number;
  stateHash: string;
}

export interface MoveRecord {
  turnNumber: number;
  player: Player;
  originPitId: string;
  sowedPits: string[];
  capturedCount: number;
  capturedPitIds: string[];
  phaseBefore: GamePhase;
  phaseAfter: GamePhase;
  summary: string;
  timestamp: number;
}

export interface GameState {
  board: Record<string, number>; // pitId -> number of seeds
  currentPlayer: Player;
  startingPlayer: Player;
  phase: GamePhase;
  capturedA: number;
  capturedB: number;
  status: GameStatus;
  winner: Player | 'draw' | null;
  turnCount: number;
  config: GameConfig;
  history: MoveRecord[];
  historyStates: { board: Record<string, number>; capturedA: number; capturedB: number; player: Player; phase: GamePhase }[];
  lastMoveResult: MoveResult | null;
  invariantAudit: {
    valid: boolean;
    totalSeeds: number;
    expectedSeeds: number;
    message: string;
  };
}

export interface GameConfig {
  mode: GameMode;
  aiDifficulty: AIDifficulty;
  aiPlayer: Player; // Usually 'B'
  profile: RuleProfile;
  animationSpeed: 'slow' | 'normal' | 'fast' | 'instant';
  soundEnabled: boolean;
  showHints: boolean;
  showCoordinates: boolean;
}
