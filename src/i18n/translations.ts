export type Language = 'pt' | 'en' | 'fr';

export interface TranslationDictionary {
  // Navigation & General
  gameTitle: string;
  gameSubtitle: string;
  gameTagline: string;
  authenticShowcaseBtn: string;
  authenticShowcaseTitle: string;
  naturalGroundSavanna: string;
  naturalGroundClay: string;
  naturalGroundLabel: string;
  lightWoodGold: string;
  lightWoodNatural: string;
  mainMenuBtn: string;
  photoRealBtn: string;
  turnLabel: string;
  phase1Title: string;
  phase2Title: string;
  fullscreenBtn: string;
  exitFullscreenBtn: string;
  handToggleBtn: string;
  handScoopCapture: string;
  
  // Menu Screen
  playVsAI: string;
  pressEnterSpace: string;
  playLocalPvP: string;
  learnRulesBtn: string;
  dossierPhotosBtn: string;
  testRunnerBtn: string;
  boardPhotoCaption: string;
  menuFooterHints: string;

  // Players & Status
  playerA: string;
  playerB: string;
  computer: string;
  southTerritory: string;
  northTerritory: string;
  boardSeeds: string;
  capturedSeeds: string;
  yourTurn: string;
  aiThinking: string;
  defenseRow: string;
  attackRow: string;
  totalSeedsRow: string;
  defenseAbbr: string;
  attackAbbr: string;

  // Board
  traditionalBoardTitle: string;
  battleFrontier: string;
  ccwCircuitDesc: string;
  attackRowLegend: string;
  defenseRowLegend: string;
  sowingInProgress: string;
  seedsInHandLabel: string;
  lastSeedLanding: string;
  relayCascadeLabel: string;
  captureLandedLabel: string;
  safeDefenseLanded: string;
  trajectoryPreview: string;
  clickToSowHint: string;

  // Controls
  undoBtn: string;
  newGameBtn: string;
  hintsBtn: string;
  soundBtn: string;
  muteBtn: string;
  conservedSeedsTag: string;
  tutorialBtn: string;
  rulesDossierBtn: string;
  testsBtn: string;
  settingsBtn: string;

  // History
  historyTitle: string;
  totalMovesLabel: string;
  noMovesYet: string;
  fromPit: string;
  pitsTraversed: string;
  withCaptures: string;
  noCaptures: string;

  // Game Over
  drawTitle: string;
  victoryPlayerA: string;
  victoryPlayerB: string;
  victoryAI: string;
  winnerLabel: string;
  turnsPlayed: string;
  playAgainBtn: string;
  closeBtn: string;

  // Difficulties & Speeds
  diffEasy: string;
  diffMedium: string;
  diffHard: string;
  speedSlow: string;
  speedNormal: string;
  speedFast: string;
  speedInstant: string;

  // Settings
  settingsTitle: string;
  languageSelectLabel: string;
  aiDifficultyLabel: string;
  animSpeedLabel: string;
  audioEffectsLabel: string;
  showHintsLabel: string;
  showCoordsLabel: string;
  ruleProfileLabel: string;
  resetDefaultsBtn: string;
  applyRestartBtn: string;

  // Tutorial / Rules
  tutorialTitle: string;
  howToPlay: string;
  objectiveTitle: string;
  objectiveDesc: string;
  sowingTitle: string;
  sowingDesc: string;
  captureTitle: string;
  captureDesc: string;
  phasesTitle: string;
  phasesDesc: string;
  startPlayingBtn: string;
}

export const translations: Record<Language, TranslationDictionary> = {
  pt: {
    gameTitle: 'BOA-MZ',
    gameSubtitle: 'NTXUVA',
    gameTagline: 'O clássico mancala moçambicano de quatro linhas de semeadura em cascata, orifícios de ataque, resguardo defensivo e capturas estratégicas.',
    authenticShowcaseBtn: 'Ver Tabuleiro Real 📷',
    authenticShowcaseTitle: 'Tabuleiro Tradicional & Sementes',
    naturalGroundSavanna: 'Areia da Savana',
    naturalGroundClay: 'Terra Batida',
    naturalGroundLabel: 'MOÇAMBIQUE · ÁREA NATURAL & TRADIÇÃO',
    lightWoodGold: 'Madeira Dourada Clara',
    lightWoodNatural: 'Teca Natural',
    mainMenuBtn: 'Menu Principal',
    photoRealBtn: 'Foto Real',
    turnLabel: 'Turno',
    phase1Title: 'Fase 1: Grupos (≥2)',
    phase2Title: 'Fase 2: Peças Individuais',
    fullscreenBtn: 'Ecrã Inteiro',
    exitFullscreenBtn: 'Sair do Ecrã Inteiro',
    handToggleBtn: 'Mão Animada',
    handScoopCapture: 'Recolha adversária',

    playVsAI: 'Jogar Contra o Computador',
    pressEnterSpace: 'Enter / Espaço',
    playLocalPvP: 'Dois Jogadores (Mesmo Dispositivo)',
    learnRulesBtn: 'Aprender Regras',
    dossierPhotosBtn: 'Dossiê & Fotos',
    testRunnerBtn: '15 Testes Motor',
    boardPhotoCaption: '🪵 Tabuleiro esculpido ou escavado no solo de areia natural',
    menuFooterHints: 'Clique / Toque para Mover · U Desfazer · R Reiniciar · M Mudo · Esc Menu',

    playerA: 'Jogador A',
    playerB: 'Jogador B',
    computer: 'Computador',
    southTerritory: '',
    northTerritory: '',
    boardSeeds: 'Tab',
    capturedSeeds: 'Capturadas',
    yourTurn: 'Vez de Jogar',
    aiThinking: 'A pensar...',
    defenseRow: 'Defesa',
    attackRow: 'Ataque',
    totalSeedsRow: 'Total',
    defenseAbbr: 'DEF',
    attackAbbr: 'ATQ',

    traditionalBoardTitle: 'TABULEIRO NTXUVA TRADICIONAL — 4 × 8',
    battleFrontier: 'FRONTEIRA DE ATAQUE E CAPTURA',
    ccwCircuitDesc: 'Circuito anti-horário: Defesa (E➔D) · Ataque (D➔E)',
    attackRowLegend: 'Fila de Ataque (Capturas)',
    defenseRowLegend: 'Fila de Defesa (Resguardo)',
    sowingInProgress: 'A semear...',
    seedsInHandLabel: 'Sementes na mão',
    lastSeedLanding: 'Última Semente',
    relayCascadeLabel: 'Cascata! Recolhendo da cova',
    captureLandedLabel: 'Captura realizada!',
    safeDefenseLanded: 'Pouso seguro na defesa',
    trajectoryPreview: 'Trajectória da Semeadura',
    clickToSowHint: 'Clique numa cova iluminada para semear',

    undoBtn: 'Desfazer',
    newGameBtn: 'Nova Partida',
    hintsBtn: 'Dicas',
    soundBtn: 'Som',
    muteBtn: 'Mudo',
    conservedSeedsTag: 'Sementes Conservadas',
    tutorialBtn: 'Tutorial',
    rulesDossierBtn: 'Regras & Validação',
    testsBtn: 'Testes (15)',
    settingsBtn: 'Definições',

    historyTitle: 'Histórico de Jogadas',
    totalMovesLabel: 'Total de Jogadas',
    noMovesYet: 'Nenhuma jogada realizada ainda. O Jogador A inicia a partida.',
    fromPit: 'de',
    pitsTraversed: 'casas percorridas',
    withCaptures: 'capt.',
    noCaptures: 'sem captura',

    drawTitle: 'Empate Técnico!',
    victoryPlayerA: 'Vitória do Jogador A!',
    victoryPlayerB: 'Vitória do Jogador B!',
    victoryAI: 'Vitória do Computador!',
    winnerLabel: 'Vencedor',
    turnsPlayed: 'Turnos disputados',
    playAgainBtn: 'Jogar Novamente',
    closeBtn: 'Fechar',

    diffEasy: 'Fácil',
    diffMedium: 'Médio',
    diffHard: 'Difícil (Mestre)',
    speedSlow: 'Lenta',
    speedNormal: 'Normal',
    speedFast: 'Rápida',
    speedInstant: 'Instantânea',

    settingsTitle: 'Definições da Partida',
    languageSelectLabel: 'Idioma / Language / Langue',
    aiDifficultyLabel: 'Dificuldade da Inteligência Artificial',
    animSpeedLabel: 'Velocidade de Semeadura',
    audioEffectsLabel: 'Efeitos Sonoros Sintetizados',
    showHintsLabel: 'Exibir Realce de Jogadas Válidas',
    showCoordsLabel: 'Exibir Coordenadas das Casas (A0-A15, B0-B15)',
    ruleProfileLabel: 'Variante de Regras',
    resetDefaultsBtn: 'Repor Padrões',
    applyRestartBtn: 'Aplicar & Reiniciar Partida',

    tutorialTitle: 'Como Jogar o Ntxuva',
    howToPlay: 'Regras e Mecânicas Básicas',
    objectiveTitle: 'Objectivo do Jogo',
    objectiveDesc: 'Capturar todas as sementes do adversário ou deixá-lo sem jogadas legais disponíveis.',
    sowingTitle: 'Semeadura em Cascata',
    sowingDesc: 'Escolha uma casa com 2 ou mais sementes (Fase 1). As sementes são distribuídas uma a uma no circuito anti-horário. Se a última semente cair numa casa já ocupada, todo o monte é recolhido e a semeadura continua.',
    captureTitle: 'Capturas Frontais',
    captureDesc: 'Quando a semeadura termina na sua fila de ataque e a casa correspondente do adversário contém sementes, todas as peças adversárias dessa coluna são capturadas.',
    phasesTitle: 'Fases da Partida',
    phasesDesc: 'Na Fase 1, apenas casas com 2 ou mais sementes podem iniciar movimentos. Quando um jogador só tem casas isoladas (1 semente), entra na Fase 2 podendo mover sementes únicas.',
    startPlayingBtn: 'Começar a Jogar',
  },

  en: {
    gameTitle: 'BOA-MZ',
    gameSubtitle: 'NTXUVA',
    gameTagline: 'The traditional Mozambican 4-row mancala with cascading sowing, attack pits, defensive sanctuaries, and tactical captures.',
    authenticShowcaseBtn: 'Real Wood Board 📷',
    authenticShowcaseTitle: 'Traditional Board & Canhu Seeds',
    naturalGroundSavanna: 'Savanna Sand',
    naturalGroundClay: 'Packed Clay',
    naturalGroundLabel: 'MOZAMBIQUE · NATURAL ARENA & HERITAGE',
    lightWoodGold: 'Bright Golden Wood',
    lightWoodNatural: 'Natural Teak',
    mainMenuBtn: 'Main Menu',
    photoRealBtn: 'Real Photo',
    turnLabel: 'Turn',
    phase1Title: 'Phase 1: Groups (≥2)',
    phase2Title: 'Phase 2: Single Seeds',
    fullscreenBtn: 'Fullscreen',
    exitFullscreenBtn: 'Exit Fullscreen',
    handToggleBtn: 'Animated Hand',
    handScoopCapture: 'Scooping capture',

    playVsAI: 'Play Against Computer',
    pressEnterSpace: 'Enter / Space',
    playLocalPvP: 'Two Players (Same Device)',
    learnRulesBtn: 'Learn Rules',
    dossierPhotosBtn: 'Dossier & Photos',
    testRunnerBtn: '15 Engine Tests',
    boardPhotoCaption: '🪵 Hand-carved board or pits dug directly into natural sand',
    menuFooterHints: 'Click / Tap to Move · U Undo · R Restart · M Mute · Esc Menu',

    playerA: 'Player A',
    playerB: 'Player B',
    computer: 'Computer',
    southTerritory: '',
    northTerritory: '',
    boardSeeds: 'Board',
    capturedSeeds: 'Captured',
    yourTurn: 'Your Turn',
    aiThinking: 'Thinking...',
    defenseRow: 'Defense',
    attackRow: 'Attack',
    totalSeedsRow: 'Total',
    defenseAbbr: 'DEF',
    attackAbbr: 'ATK',

    traditionalBoardTitle: 'TRADITIONAL NTXUVA BOARD — 4 × 8',
    battleFrontier: 'ATTACK & CAPTURE FRONTIER',
    ccwCircuitDesc: 'Counter-clockwise circuit: Defense (L➔R) · Attack (R➔L)',
    attackRowLegend: 'Attack Row (Captures)',
    defenseRowLegend: 'Defense Row (Sanctuary)',
    sowingInProgress: 'Sowing in progress...',
    seedsInHandLabel: 'Seeds in hand',
    lastSeedLanding: 'Last Seed',
    relayCascadeLabel: 'Relay Cascade! Picking up from pit',
    captureLandedLabel: 'Capture executed!',
    safeDefenseLanded: 'Safe landing in defense',
    trajectoryPreview: 'Sowing Trajectory',
    clickToSowHint: 'Click a highlighted pit to start sowing',

    undoBtn: 'Undo',
    newGameBtn: 'New Match',
    hintsBtn: 'Hints',
    soundBtn: 'Sound',
    muteBtn: 'Mute',
    conservedSeedsTag: 'Conserved Seeds',
    tutorialBtn: 'Tutorial',
    rulesDossierBtn: 'Rules & Validation',
    testsBtn: 'Tests (15)',
    settingsBtn: 'Settings',

    historyTitle: 'Move History',
    totalMovesLabel: 'Total Moves',
    noMovesYet: 'No moves recorded yet. Player A starts the game.',
    fromPit: 'from',
    pitsTraversed: 'pits traversed',
    withCaptures: 'capt.',
    noCaptures: 'no capture',

    drawTitle: 'Technical Draw!',
    victoryPlayerA: 'Player A Wins!',
    victoryPlayerB: 'Player B Wins!',
    victoryAI: 'Computer Wins!',
    winnerLabel: 'Winner',
    turnsPlayed: 'Turns played',
    playAgainBtn: 'Play Again',
    closeBtn: 'Close',

    diffEasy: 'Easy',
    diffMedium: 'Medium',
    diffHard: 'Hard (Master)',
    speedSlow: 'Slow',
    speedNormal: 'Normal',
    speedFast: 'Fast',
    speedInstant: 'Instant',

    settingsTitle: 'Match Settings',
    languageSelectLabel: 'Language / Idioma / Langue',
    aiDifficultyLabel: 'AI Bot Difficulty',
    animSpeedLabel: 'Sowing Animation Speed',
    audioEffectsLabel: 'Synthesized Sound Effects',
    showHintsLabel: 'Highlight Legal Moves',
    showCoordsLabel: 'Show Pit Coordinates (A0-A15, B0-B15)',
    ruleProfileLabel: 'Rules Variant',
    resetDefaultsBtn: 'Reset to Defaults',
    applyRestartBtn: 'Apply & Restart Match',

    tutorialTitle: 'How to Play Ntxuva',
    howToPlay: 'Core Rules & Mechanics',
    objectiveTitle: 'Game Objective',
    objectiveDesc: 'Capture all of your opponent’s seeds or leave them with no legal moves available.',
    sowingTitle: 'Cascading Relay Sowing',
    sowingDesc: 'Pick a pit containing 2 or more seeds (Phase 1). Seeds are sowed one by one in a counter-clockwise loop. If the final seed lands in an occupied pit, all seeds in that pit are picked up and sowing continues.',
    captureTitle: 'Frontal Captures',
    captureDesc: 'When sowing ends in your attack row and the opposing pit directly across contains seeds, you capture the opponent’s pieces from that column.',
    phasesTitle: 'Game Phases',
    phasesDesc: 'In Phase 1, only pits with 2 or more seeds can initiate moves. When a player has only single seeds remaining, Phase 2 begins allowing single seeds to be moved.',
    startPlayingBtn: 'Start Playing',
  },

  fr: {
    gameTitle: 'BOA-MZ',
    gameSubtitle: 'NTXUVA',
    gameTagline: 'Le mancala traditionnel mozambicain à quatre rangées, avec semailles en cascade, fosses d’attaque, sanctuaires défensifs et captures stratégiques.',
    authenticShowcaseBtn: 'Plateau en Bois Réel 📷',
    authenticShowcaseTitle: 'Plateau Traditionnel & Graines',
    naturalGroundSavanna: 'Sable de la Savane',
    naturalGroundClay: 'Terre Battue',
    naturalGroundLabel: 'MOZAMBIQUE · ARÈNE NATURELLE & TRADITION',
    lightWoodGold: 'Bois Doré Clair',
    lightWoodNatural: 'Teck Naturel',
    mainMenuBtn: 'Menu Principal',
    photoRealBtn: 'Photo Réelle',
    turnLabel: 'Tour',
    phase1Title: 'Phase 1: Groupes (≥2)',
    phase2Title: 'Phase 2: Graines Uniques',
    fullscreenBtn: 'Plein Écran',
    exitFullscreenBtn: 'Quitter Plein Écran',
    handToggleBtn: 'Main Animée',
    handScoopCapture: 'Prise adverse',

    playVsAI: 'Jouer Contre l’Ordinateur',
    pressEnterSpace: 'Entrée / Espace',
    playLocalPvP: 'Deux Joueurs (Même Appareil)',
    learnRulesBtn: 'Apprendre les Règles',
    dossierPhotosBtn: 'Dossier & Photos',
    testRunnerBtn: '15 Tests Moteur',
    boardPhotoCaption: '🪵 Plateau sculpté ou fosses creusées à même le sable naturel',
    menuFooterHints: 'Cliquer / Toucher pour Jouer · U Annuler · R Redémarrer · M Muet · Échap Menu',

    playerA: 'Joueur A',
    playerB: 'Joueur B',
    computer: 'Ordinateur',
    southTerritory: '',
    northTerritory: '',
    boardSeeds: 'Plateau',
    capturedSeeds: 'Capturées',
    yourTurn: 'À vous de jouer',
    aiThinking: 'Réflexion en cours...',
    defenseRow: 'Défense',
    attackRow: 'Attaque',
    totalSeedsRow: 'Total',
    defenseAbbr: 'DÉF',
    attackAbbr: 'ATQ',

    traditionalBoardTitle: 'PLATEAU TRADITIONNEL DU NTXUVA — 4 × 8',
    battleFrontier: 'FRONTIÈRE D’ATTAQUE ET DE CAPTURE',
    ccwCircuitDesc: 'Circuit antihoraire: Défense (G➔D) · Attaque (D➔G)',
    attackRowLegend: 'Rangée d’Attaque (Captures)',
    defenseRowLegend: 'Rangée de Défense (Sanctuaire)',
    sowingInProgress: 'Semis en cours...',
    seedsInHandLabel: 'Graines en main',
    lastSeedLanding: 'Dernière Graine',
    relayCascadeLabel: 'Cascade ! Reprise de la fosse',
    captureLandedLabel: 'Capture effectuée !',
    safeDefenseLanded: 'Atterrissage sécurisé en défense',
    trajectoryPreview: 'Trajectoire du Semis',
    clickToSowHint: 'Cliquez sur une fosse en surbrillance pour semer',

    undoBtn: 'Annuler',
    newGameBtn: 'Nouvelle Partie',
    hintsBtn: 'Indices',
    soundBtn: 'Son',
    muteBtn: 'Muet',
    conservedSeedsTag: 'Graines Conservées',
    tutorialBtn: 'Tutoriel',
    rulesDossierBtn: 'Règles & Validation',
    testsBtn: 'Tests (15)',
    settingsBtn: 'Paramètres',

    historyTitle: 'Historique des Coups',
    totalMovesLabel: 'Total des Coups',
    noMovesYet: 'Aucun coup joué pour l’instant. Le Joueur A commence la partie.',
    fromPit: 'depuis',
    pitsTraversed: 'fosses parcourues',
    withCaptures: 'capt.',
    noCaptures: 'sans capture',

    drawTitle: 'Match Nul Technique !',
    victoryPlayerA: 'Victoire du Joueur A !',
    victoryPlayerB: 'Victoire du Joueur B !',
    victoryAI: 'Victoire de l’Ordinateur !',
    winnerLabel: 'Vainqueur',
    turnsPlayed: 'Tours disputés',
    playAgainBtn: 'Rejouer',
    closeBtn: 'Fermer',

    diffEasy: 'Facile',
    diffMedium: 'Moyen',
    diffHard: 'Difficile (Maître)',
    speedSlow: 'Lente',
    speedNormal: 'Normale',
    speedFast: 'Rapide',
    speedInstant: 'Instantanée',

    settingsTitle: 'Paramètres de la Partie',
    languageSelectLabel: 'Langue / Language / Idioma',
    aiDifficultyLabel: 'Difficulté de l’IA',
    animSpeedLabel: 'Vitesse de Semis',
    audioEffectsLabel: 'Effets Sonores Synthétisés',
    showHintsLabel: 'Afficher les Coups Légaux',
    showCoordsLabel: 'Afficher les Coordonnées des Fosses (A0-A15, B0-B15)',
    ruleProfileLabel: 'Variante des Règles',
    resetDefaultsBtn: 'Rétablir par Défaut',
    applyRestartBtn: 'Appliquer & Redémarrer',

    tutorialTitle: 'Comment Jouer au Ntxuva',
    howToPlay: 'Règles et Mécaniques de Base',
    objectiveTitle: 'Objectif du Jeu',
    objectiveDesc: 'Capturer toutes les graines de l’adversaire ou le priver de tout coup légal.',
    sowingTitle: 'Semis en Cascade',
    sowingDesc: 'Choisissez une fosse contenant 2 graines ou plus (Phase 1). Les graines sont semées une par une dans le sens antihoraire. Si la dernière graine tombe dans une fosse occupée, ramassez tout et poursuivez le semis sans passer la main !',
    captureTitle: 'Captures Frontales',
    captureDesc: 'Lorsque le semis s’achève dans votre rangée d’attaque et que la fosse adverse en vis-à-vis contient des pièces, vous capturez toutes les pièces adverses de cette colonne.',
    phasesTitle: 'Phases de la Partie',
    phasesDesc: 'Durant la Phase 1, seules les fosses d’au moins 2 graines peuvent débuter un coup. Quand un joueur n’a plus que des graines isolées, la Phase 2 commence permettant de semer des graines uniques.',
    startPlayingBtn: 'Commencer la Partie',
  },
};
