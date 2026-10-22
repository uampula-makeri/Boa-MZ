import { RuleProfile } from '../engine/types';

export const DEFAULT_RULE_PROFILE: RuleProfile = {
  id: 'NTXUVA-4X8',
  name: 'Ntxuva Tradicional',
  variantSubtitle: 'Regras Tradicionais 4 × 8',
  version: '1.0.0',
  culturalStatus: 'validated',
  cols: 8,
  initialSeedsPerPit: 2,
  
  // Semeadura e Continuação
  relayIfOccupied: true, // Cascata se última semente cair em casa ocupada
  maxRelayIterations: 80, // Prevenção de loop
  
  // Regras de Pouso em Casa Vazia
  emptyDefenseEndsTurn: true, // Termina o turno sem capturar
  emptyAttackTriggersCapture: true, // Dispara verificação de captura na linha adversária
  
  // Captura
  captureScope: 'attack_and_defense', // Captura ataque e defesa da coluna correspondente
  captureRequiresAttackOccupied: true, // Requer que a linha de ataque adversária tenha sementes
  mandatoryCapture: false, // O jogador é livre para escolher sua jogada
  relayAfterCapture: false, // Captura finaliza o turno (recolha para o monte de capturas)
  
  // Fase 2 e Peças Individuais
  allowSingleSeedWhenNoGroups: true, // Permite mover 1 semente se não houver casas com > 1 sementes
  autoPhase2Transition: true, // Ativa fase 2 quando apenas sementes isoladas restam
  singleSeedStepDistance: 1, // Deslocamento de 1 casa
  
  // Fim de jogo
  winByElimination: true, // Todas as sementes do adversário eliminadas do tabuleiro
  winByNoLegalMoves: true, // Adversário sem jogadas válidas
  maxTurnLimit: 250, // Limite para empate técnico
};

export const ALTERNATE_PROFILES: RuleProfile[] = [
  DEFAULT_RULE_PROFILE,
  {
    ...DEFAULT_RULE_PROFILE,
    id: 'NTXUVA-ATTACK-ONLY',
    name: 'Ntxuva — Captura Simples',
    variantSubtitle: 'Variante com captura restrita apenas à linha de ataque',
    culturalStatus: 'experimental',
    captureScope: 'attack_only',
  },
  {
    ...DEFAULT_RULE_PROFILE,
    id: 'NTXUVA-MANDATORY',
    name: 'Ntxuva — Captura Obrigatória',
    variantSubtitle: 'Obrigatório capturar sempre que houver oportunidade',
    culturalStatus: 'experimental',
    mandatoryCapture: true,
  },
];
