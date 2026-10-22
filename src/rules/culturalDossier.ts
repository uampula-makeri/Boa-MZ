/**
 * BOA-MZ: Módulo de Validação Cultural e Documental do Ntxuva
 * Fichas de regras, fontes antropológicas e questionário para praticantes do Sul de Moçambique
 */

export interface RuleCard {
  code: string;
  title: string;
  description: string;
  sourceDoc?: string;
  sourceUrl?: string;
  evidenceMozambique: string;
  status: 'documentada' | 'provisional' | 'por_validar';
  configParameter: string;
  demoPositionNote: string;
  expectedResult: string;
  validationNotes: string;
  lastUpdated: string;
}

export const CULTURAL_RULE_CARDS: RuleCard[] = [
  {
    code: 'REG-01-DIM',
    title: 'Dimensão do Tabuleiro 4 × 8 (32 Casas)',
    description: 'Tabuleiro escavado no chão ou em madeira maciça com 4 filas de 8 orifícios, totalizando 32 casas circulares.',
    sourceDoc: 'Planeta Editora — Descrição do Ntchuva em Moçambique / Ntxuva.org',
    evidenceMozambique: 'Comum nas províncias de Maputo, Gaza e Inhambane (Changana, Ronga e Chope). Existem variantes com 4×10 ou 4×12 noutras regiões.',
    status: 'documentada',
    configParameter: 'cols = 8, rows = 4',
    demoPositionNote: 'Posição inicial de 32 casas (16 para o Jogador A, 16 para o Jogador B).',
    expectedResult: 'Exactamente 32 casas com duas linhas de defesa e duas linhas de ataque.',
    validationNotes: 'Confirmada amplamente no Sul. Algumas variantes rurais usam 4×10 em competições informais.',
    lastUpdated: '2026-10-22',
  },
  {
    code: 'REG-02-INIT',
    title: 'Distribuição Inicial (2 Sementes por Casa)',
    description: 'Cada casa inicia com 2 sementes, pedras pequenas ou nozes (canhu), totalizando 64 sementes.',
    sourceDoc: 'Estudos etnográficos de jogos de mancala na África Austral',
    evidenceMozambique: 'Padrão tradicional mais comum no Sul. Em certas povoações pode iniciar com 3 sementes por casa.',
    status: 'provisional',
    configParameter: 'initialSeedsPerPit = 2',
    demoPositionNote: '64 sementes no total, 32 por jogador.',
    expectedResult: 'Início equilibrado sem peças capturadas.',
    validationNotes: 'Necessita verificação para confirmar se a variante de Maputo prefere 2 ou 3 sementes.',
    lastUpdated: '2026-10-22',
  },
  {
    code: 'REG-03-CIRCUIT',
    title: 'Percurso Anti-Horário Exclusivo por Jogador',
    description: 'Cada jogador semeia exclusivamente nas suas 16 casas, circulando no sentido anti-horário entre a sua fila de defesa e de ataque.',
    sourceDoc: 'Regras documentadas do Ntxuva Moçambicano',
    evidenceMozambique: 'Universal entre praticantes: as sementes de um jogador nunca entram no território físico do adversário durante a semeadura.',
    status: 'documentada',
    configParameter: 'trackCircuit = counterClockwise',
    demoPositionNote: 'Jogador A move de A0 a A7 na defesa e de A15 a A8 no ataque.',
    expectedResult: 'Circuito fechado de 16 casas para cada jogador.',
    validationNotes: 'Totalmente consensual entre jogadores tradicionais.',
    lastUpdated: '2026-10-22',
  },
  {
    code: 'REG-04-RELAY',
    title: 'Semeadura em Cascata (Continuação)',
    description: 'Quando a última semente cai numa casa que já tinha sementes (ficando com 2 ou mais), o jogador recolhe todas as sementes dessa casa e continua a semeadura.',
    sourceDoc: 'Planeta Editora / Descrição de jogos Mancala de 4 linhas',
    evidenceMozambique: 'Elemento dinâmico fulcral no Ntxuva, permitindo jogadas longas e estratégicas.',
    status: 'documentada',
    configParameter: 'relayIfOccupied = true',
    demoPositionNote: 'Última semente cai em casa com 1 semente (total 2). O jogador recolhe as 2 e prossegue.',
    expectedResult: 'A semeadura prossegue sem passar a vez.',
    validationNotes: 'Confirmada. A questão pendente é o comportamento exato se a cascata passar por casas de ataque vazias.',
    lastUpdated: '2026-10-22',
  },
  {
    code: 'REG-05-EMPTY-DEF',
    title: 'Pouso em Casa Vazia de Defesa',
    description: 'Quando a última semente cai numa casa de defesa que estava desocupada, o turno termina imediatamente sem qualquer captura.',
    sourceDoc: 'Ntxuva traditional play',
    evidenceMozambique: 'A linha de defesa serve de resguardo estratégico para sementes e fim de semeadura defensiva.',
    status: 'documentada',
    configParameter: 'emptyDefenseEndsTurn = true',
    demoPositionNote: 'Última semente pousa em A3 (que tinha 0 sementes).',
    expectedResult: 'O turno de A termina e passa para o Jogador B.',
    validationNotes: 'Consensual. As casas de defesa não efetuam captura direta.',
    lastUpdated: '2026-10-22',
  },
  {
    code: 'REG-06-CAPTURE-ATT',
    title: 'Captura em Casa Vazia de Ataque',
    description: 'Quando a última semente cai numa casa de ataque anteriormente vazia, o jogador captura as peças da coluna oposta do adversário (se a casa interior contiver peças).',
    sourceDoc: 'Literatura comparada de Mancalas austrais',
    evidenceMozambique: 'Prática no Sul de Moçambique: a casa interior de ataque do adversário é a sentinela que permite penetrar na defesa.',
    status: 'provisional',
    configParameter: 'emptyAttackTriggersCapture = true & captureScope = attack_and_defense',
    demoPositionNote: 'A cai em A10 (vazia). B10 tem 3 peças, B2 tem 2 peças.',
    expectedResult: 'Jogador A captura as 3 peças de B10 e as 2 peças de B2 (total 5 capturadas). Turno termina.',
    validationNotes: 'Provisória: algumas variantes capturam apenas a casa interior (B10) e só capturam a defesa (B2) se a interior estiver ocupada.',
    lastUpdated: '2026-10-22',
  },
  {
    code: 'REG-07-PHASE2',
    title: 'Fase de Peças Individuais (Fim do Jogo)',
    description: 'Quando um jogador não tem nenhuma casa com 2 ou mais sementes, entra na fase de movimentação individual com passos de 1 casa.',
    sourceDoc: 'Estudos de M’pale e Ntxuva',
    evidenceMozambique: 'Evita bloqueio do jogo e permite tentar criar grupos ou capturas finais.',
    status: 'por_validar',
    configParameter: 'autoPhase2Transition = true, allowSingleSeedWhenNoGroups = true',
    demoPositionNote: 'Jogador A tem apenas casas com 0 ou 1 semente.',
    expectedResult: 'Permite selecionar casa com 1 semente e avançá-la 1 casa.',
    validationNotes: 'Necessita confirmação rigorosa com mestres locais sobre se a peça individual pode capturar ou apenas mover.',
    lastUpdated: '2026-10-22',
  },
];

export const PRACTITIONER_INTERVIEW_QUESTIONS = [
  {
    category: 'Estrutura e Origem',
    questions: [
      'Qual é o nome tradicional pelo qual conhece o jogo (Ntxuva, Ntchuva, Tsovha)?',
      'Costumam jogar em tabuleiro escavado no solo ou esculpido em tronco de árvore?',
      'Quantas casas por fila são usadas na sua comunidade (8, 10 ou 12 casas)?',
      'Quantas sementes (ou pedras) são colocadas em cada casa antes de começar (2 ou 3)?'
    ]
  },
  {
    category: 'Semeadura e Ataque',
    questions: [
      'O sentido é sempre anti-horário para os dois jogadores?',
      'Quando a última semente cai numa casa que já tinha sementes, é obrigatório continuar a semear?',
      'Se a última semente cair numa casa vazia da linha de ataque, como funciona a captura?',
      'Captura-se a casa da frente (ataque) e a de trás (defesa) ao mesmo tempo?',
      'Se a casa da frente do adversário estiver vazia, pode-se capturar a casa de defesa que está atrás dela?'
    ]
  },
  {
    category: 'Capturas e Continuação',
    questions: [
      'Depois de capturar as peças do adversário, o jogador guarda-as ou continua a semear com elas?',
      'A captura é obrigatória se o jogador tiver uma jogada que capture peças?',
      'Um jogador pode optar deliberadamente por uma jogada que não captura para proteger o seu tabuleiro?'
    ]
  },
  {
    category: 'Final de Jogo e Peças Únicas',
    questions: [
      'O que acontece quando um jogador fica apenas com sementes isoladas (1 por casa)?',
      'Pode mover 1 semente para a casa seguinte para formar grupos?',
      'Como se determina o vencedor: quando um jogador não tem mais sementes ou quando não pode jogar?'
    ]
  }
];
