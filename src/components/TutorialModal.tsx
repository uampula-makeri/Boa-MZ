import React, { useState } from 'react';
import { X, ChevronRight, ChevronLeft, Award, Sparkles, Swords, Shield, RotateCw } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TutorialStep {
  title: string;
  category: string;
  icon: React.ReactNode;
  content: string;
  keyTakeaway: string;
  visualGraphic: React.ReactNode;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({ isOpen, onClose }) => {
  const { language, t } = useLanguage();
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  if (!isOpen) return null;

  const stepsPT: TutorialStep[] = [
    {
      title: '1. O Objectivo do Jogo & Tabuleiro 4×8',
      category: 'Estrutura Inicial',
      icon: <Award className="w-5 h-5 text-amber-800" />,
      content:
        'O Ntxuva é um jogo tradicional de estratégia milenar praticado no Sul de Moçambique. O tabuleiro é composto por 4 filas de 8 casas circulares (32 casas no total), com 2 sementes em cada casa no início da partida (64 sementes no total). O objetivo principal é capturar as peças do adversário e dominar o tabuleiro.',
      keyTakeaway: '64 sementes no total, distribuídas equilibradamente (32 por jogador).',
      visualGraphic: (
        <div className="p-4 rounded-xl bg-[#f5ecdf] border-2 border-amber-900/30 flex flex-col items-center gap-2 font-bold text-xs">
          <div className="text-blue-950 font-mono">Jogador B: Fila Defesa [B0..B7] & Fila Ataque [B8..B15]</div>
          <div className="w-full h-0.5 bg-amber-800/40 my-1" />
          <div className="text-amber-950 font-mono">Jogador A: Fila Ataque [A8..A15] & Fila Defesa [A0..A7]</div>
        </div>
      ),
    },
    {
      title: '2. Filas de Ataque vs Filas de Defesa',
      category: 'Geometria do Tabuleiro',
      icon: <Swords className="w-5 h-5 text-rose-800" />,
      content:
        'Cada jogador controla 2 filas: uma fila interior (mais próxima do centro) e uma fila exterior (mais distante). A fila interior é a linha de ATAQUE (onde ocorrem as capturas). A fila exterior é a linha de DEFESA (onde as sementes ficam em resguardo). A classificação depende da posição física da casa, não de sua cor.',
      keyTakeaway: 'Ataque = fila interior central. Defesa = fila exterior periférica.',
      visualGraphic: (
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-rose-100 border-2 border-rose-500 text-rose-950 font-bold">
            <span className="font-black block mb-1">⚔ Linha de Ataque (Interior):</span>
            Permite capturar peças inimigas se a última semente cair numa casa que estava vazia.
          </div>
          <div className="p-3 rounded-xl bg-emerald-100 border-2 border-emerald-500 text-emerald-950 font-bold">
            <span className="font-black block mb-1">🛡 Linha de Defesa (Exterior):</span>
            Termina o turno defensivamente se a última semente cair numa casa vazia, sem capturas.
          </div>
        </div>
      ),
    },
    {
      title: '3. O Percurso Anti-Horário Exclusivo',
      category: 'Semeadura',
      icon: <RotateCw className="w-5 h-5 text-amber-800" />,
      content:
        'Cada jogador semeia exclusivamente nas suas 16 casas em circuito fechado no sentido anti-horário! Para o Jogador A: move na defesa da esquerda para a direita (A0 a A7), sobe para a linha de ataque (A15 a A8) movendo para a esquerda, e regressa a A0. As sementes nunca entram no território físico do adversário.',
      keyTakeaway: 'Circuito fechado de 16 casas exclusivo para cada jogador.',
      visualGraphic: (
        <div className="p-3 rounded-xl bg-[#f5ecdf] border-2 border-amber-900/30 flex items-center justify-center gap-3 text-xs font-mono font-black text-amber-950">
          <span>Defesa: A0 → A7</span>
          <span>➜</span>
          <span>Ataque: A15 → A8</span>
          <span>➜</span>
          <span>(Ciclo ↺)</span>
        </div>
      ),
    },
    {
      title: '4. Semeadura em Cascata (Relay Continuation)',
      category: 'Dinamismo',
      icon: <Sparkles className="w-5 h-5 text-blue-800" />,
      content:
        'Na Fase 1, o jogador deve escolher uma casa com 2 ou mais sementes. Recolhe todas e distribui uma em cada casa sucessiva. Quando a última semente cai numa casa que já continha sementes (ficando com 2 ou mais), ocorre uma cascata: o jogador recolhe todas as peças dessa casa e continua a semear sem passar a vez!',
      keyTakeaway: 'Caiu em casa ocupada? Recolhe tudo e continua a semear!',
      visualGraphic: (
        <div className="p-3 rounded-xl bg-blue-100 border-2 border-blue-500 text-blue-950 text-xs font-bold">
          Última semente cai numa casa com 2 peças (total 3) ➔ Jogador recolhe as 3 peças e continua a semear imediatamente pelo circuito.
        </div>
      ),
    },
    {
      title: '5. Como Capturar as Peças do Adversário',
      category: 'Regra de Captura',
      icon: <Swords className="w-5 h-5 text-rose-800" />,
      content:
        'A captura ocorre quando a última semente da semeadura cai numa casa de ATAQUE que estava VAZIA (ficando com exactamente 1 peça). Se a casa de ataque correspondente do adversário na mesma coluna contiver sementes, todas são capturadas! Na variante do Sul, as sementes da casa de defesa da mesma coluna também são recolhidas.',
      keyTakeaway: 'Pouso em casa vazia de ataque + linha interior inimiga com sementes = CAPTURA!',
      visualGraphic: (
        <div className="p-3 rounded-xl bg-rose-100 border-2 border-rose-500 text-rose-950 text-xs font-mono font-bold">
          <div>[B-Defesa: B2 (2)] ➔ CAPTURADA!</div>
          <div>[B-Ataque: B10 (3)] ➔ CAPTURADA!</div>
          <div className="text-amber-950 mt-1 font-black">▲ Oposto a: A-Ataque A10 (pousou em casa que estava vazia)</div>
        </div>
      ),
    },
    {
      title: '6. Pouso em Casa de Defesa & Fim de Turno',
      category: 'Regra de Defesa',
      icon: <Shield className="w-5 h-5 text-emerald-800" />,
      content:
        'Se a última semente cair numa casa de DEFESA que estava vazia, a jogada termina imediatamente em segurança. Não há captura. A vez passa para o adversário. A defesa serve como refúgio estratégico para evitar que as suas sementes fiquem expostas às capturas nas casas interiores.',
      keyTakeaway: 'Pouso em casa vazia de defesa = fim de jogada seguro.',
      visualGraphic: (
        <div className="p-3 rounded-xl bg-emerald-100 border-2 border-emerald-500 text-emerald-950 text-xs font-bold">
          Última semente caiu em A3 (defesa vazia) ➔ Turno de A termina pacificamente. Jogador B inicia a sua jogada.
        </div>
      ),
    },
    {
      title: '7. Fase de Peças Individuais & Condição de Vitória',
      category: 'Final de Partida',
      icon: <Award className="w-5 h-5 text-amber-800" />,
      content:
        'Quando um jogador fica apenas com sementes isoladas (1 por casa), transita para a Fase 2, podendo mover peças individuais de 1 em 1 casa para reagrupá-las ou tentar capturas. A partida termina com a vitória do jogador quando todas as sementes do adversário são capturadas ou quando o adversário não dispuser de jogadas legais.',
      keyTakeaway: 'Elimine todas as peças do adversário ou deixe-o sem movimentos legais para vencer!',
      visualGraphic: (
        <div className="p-3 rounded-xl bg-amber-100 border-2 border-amber-600 text-amber-950 text-xs font-black">
          🏆 Vitória: O adversário fica com 0 sementes no tabuleiro ou sem movimentos permitidos.
        </div>
      ),
    },
  ];

  const stepsEN: TutorialStep[] = [
    {
      title: '1. Objective & 4×8 Board Structure',
      category: 'Initial Setup',
      icon: <Award className="w-5 h-5 text-amber-800" />,
      content:
        'Ntxuva is an ancient traditional strategy game from Southern Mozambique. The board consists of 4 rows of 8 circular pits (32 pits total), with 2 seeds in each pit at the start (64 seeds total). The main objective is to capture the opponent’s pieces and control the board.',
      keyTakeaway: '64 total seeds, distributed symmetrically (32 per player).',
      visualGraphic: (
        <div className="p-4 rounded-xl bg-[#f5ecdf] border-2 border-amber-900/30 flex flex-col items-center gap-2 font-bold text-xs">
          <div className="text-blue-950 font-mono">Player B: Defense Row [B0..B7] & Attack Row [B8..B15]</div>
          <div className="w-full h-0.5 bg-amber-800/40 my-1" />
          <div className="text-amber-950 font-mono">Player A: Attack Row [A8..A15] & Defense Row [A0..A7]</div>
        </div>
      ),
    },
    {
      title: '2. Attack vs Defense Rows',
      category: 'Board Geometry',
      icon: <Swords className="w-5 h-5 text-rose-800" />,
      content:
        'Each player controls 2 rows: an inner row (closest to the center) and an outer row (furthest). The inner row is the ATTACK line (where captures occur). The outer row is the DEFENSE line (where seeds rest in safety). Classification depends on spatial position, not color.',
      keyTakeaway: 'Attack = inner central row. Defense = outer sanctuary row.',
      visualGraphic: (
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-rose-100 border-2 border-rose-500 text-rose-950 font-bold">
            <span className="font-black block mb-1">⚔ Attack Row (Inner):</span>
            Allows capturing enemy pieces if your final seed lands into an empty pit.
          </div>
          <div className="p-3 rounded-xl bg-emerald-100 border-2 border-emerald-500 text-emerald-950 font-bold">
            <span className="font-black block mb-1">🛡 Defense Row (Outer):</span>
            Ends the turn defensively with no capture if the final seed lands into an empty pit.
          </div>
        </div>
      ),
    },
    {
      title: '3. Exclusive Counter-Clockwise Loop',
      category: 'Sowing Rules',
      icon: <RotateCw className="w-5 h-5 text-amber-800" />,
      content:
        'Each player sows exclusively within their own 16 pits in a closed counter-clockwise loop! For Player A: moves left to right on defense (A0 to A7), goes up to attack (A15 to A8) moving left, and loops back to A0. Seeds never enter the physical side of the opponent.',
      keyTakeaway: 'Closed 16-pit circuit exclusive to each player.',
      visualGraphic: (
        <div className="p-3 rounded-xl bg-[#f5ecdf] border-2 border-amber-900/30 flex items-center justify-center gap-3 text-xs font-mono font-black text-amber-950">
          <span>Defense: A0 → A7</span>
          <span>➜</span>
          <span>Attack: A15 → A8</span>
          <span>➜</span>
          <span>(Loop ↺)</span>
        </div>
      ),
    },
    {
      title: '4. Cascading Relay Sowing',
      category: 'Cascading Momentum',
      icon: <Sparkles className="w-5 h-5 text-blue-800" />,
      content:
        'In Phase 1, you must choose a pit with 2 or more seeds. Pick them all up and sow one in each subsequent pit. If the final seed drops into an already occupied pit, a relay cascade triggers: pick up all seeds in that pit and continue sowing!',
      keyTakeaway: 'Landed in an occupied pit? Pick up all and keep sowing!',
      visualGraphic: (
        <div className="p-3 rounded-xl bg-blue-100 border-2 border-blue-500 text-blue-950 text-xs font-bold">
          Final seed lands in a pit with 2 seeds (total 3) ➔ Player picks up all 3 seeds and immediately continues sowing along the circuit.
        </div>
      ),
    },
    {
      title: '5. How to Capture Opponent Pieces',
      category: 'Capture Rules',
      icon: <Swords className="w-5 h-5 text-rose-800" />,
      content:
        'A capture occurs when the final seed lands into an ATTACK pit that was previously EMPTY (holding exactly 1 piece). If the corresponding opposing attack pit in the same column contains seeds, they are captured! In Southern rules, the defense pit in that column is also seized.',
      keyTakeaway: 'Landing in an empty attack pit + enemy column has seeds = CAPTURE!',
      visualGraphic: (
        <div className="p-3 rounded-xl bg-rose-100 border-2 border-rose-500 text-rose-950 text-xs font-mono font-bold">
          <div>[B-Defense: B2 (2)] ➔ CAPTURED!</div>
          <div>[B-Attack: B10 (3)] ➔ CAPTURED!</div>
          <div className="text-amber-950 mt-1 font-black">▲ Opposite: A-Attack A10 (landed in an empty pit)</div>
        </div>
      ),
    },
    {
      title: '6. Landing in Defense & Turn End',
      category: 'Defense Sanctuary',
      icon: <Shield className="w-5 h-5 text-emerald-800" />,
      content:
        'If the final seed falls into an empty DEFENSE pit, your turn ends immediately and safely. No captures are made. Turn passes to the opponent. Defense acts as a strategic sanctuary against enemy raids.',
      keyTakeaway: 'Landed in empty defense = safe turn completion.',
      visualGraphic: (
        <div className="p-3 rounded-xl bg-emerald-100 border-2 border-emerald-500 text-emerald-950 text-xs font-bold">
          Final seed landed in A3 (empty defense) ➔ Player A turn ends safely. Player B begins their turn.
        </div>
      ),
    },
    {
      title: '7. Single Seed Phase & Victory',
      category: 'Endgame',
      icon: <Award className="w-5 h-5 text-amber-800" />,
      content:
        'When a player is reduced to only isolated single seeds (1 per pit), they enter Phase 2, allowing individual seeds to move 1 pit to regroup or trigger captures. Victory is achieved when all enemy seeds are captured or the opponent has no legal moves left.',
      keyTakeaway: 'Capture all opponent seeds or immobilize them to win!',
      visualGraphic: (
        <div className="p-3 rounded-xl bg-amber-100 border-2 border-amber-600 text-amber-950 text-xs font-black">
          🏆 Victory: Opponent reaches 0 seeds on board or has no legal moves.
        </div>
      ),
    },
  ];

  const stepsFR: TutorialStep[] = [
    {
      title: '1. Objectif & Plateau 4×8',
      category: 'Structure Initiale',
      icon: <Award className="w-5 h-5 text-amber-800" />,
      content:
        'Le Ntxuva est un jeu de stratégie millénaire du Sud du Mozambique. Le plateau compte 4 rangées de 8 fosses (32 fosses au total), avec 2 graines par fosse au début (64 graines au total). L’objectif est de capturer les pièces adverses et de dominer le plateau.',
      keyTakeaway: '64 graines au total, réparties équitablement (32 par joueur).',
      visualGraphic: (
        <div className="p-4 rounded-xl bg-[#f5ecdf] border-2 border-amber-900/30 flex flex-col items-center gap-2 font-bold text-xs">
          <div className="text-blue-950 font-mono">Joueur B: Rangée Défense [B0..B7] & Attaque [B8..B15]</div>
          <div className="w-full h-0.5 bg-amber-800/40 my-1" />
          <div className="text-amber-950 font-mono">Joueur A: Rangée Attaque [A8..A15] & Défense [A0..A7]</div>
        </div>
      ),
    },
    {
      title: '2. Rangées d’Attaque vs Défense',
      category: 'Géométrie du Plateau',
      icon: <Swords className="w-5 h-5 text-rose-800" />,
      content:
        'Chaque joueur contrôle 2 rangées: une intérieure (proche du centre) et une extérieure. La rangée intérieure est la ligne d’ATTAQUE (lieu des captures). La rangée extérieure est la ligne de DÉFENSE (sanctuaire sécurisé).',
      keyTakeaway: 'Attaque = rangée intérieure centrale. Défense = rangée extérieure.',
      visualGraphic: (
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-rose-100 border-2 border-rose-500 text-rose-950 font-bold">
            <span className="font-black block mb-1">⚔ Ligne d’Attaque (Intérieure):</span>
            Permet de capturer les pièces ennemies si la dernière graine tombe dans une fosse vide.
          </div>
          <div className="p-3 rounded-xl bg-emerald-100 border-2 border-emerald-500 text-emerald-950 font-bold">
            <span className="font-black block mb-1">🛡 Ligne de Défense (Extérieure):</span>
            Met fin au tour défensivement si la dernière graine tombe dans une fosse vide.
          </div>
        </div>
      ),
    },
    {
      title: '3. Circuit Antihoraire Exclusif',
      category: 'Semis',
      icon: <RotateCw className="w-5 h-5 text-amber-800" />,
      content:
        'Chaque joueur sème exclusivement dans ses 16 fosses selon une boucle fermée en sens antihoraire ! Les graines ne pénètrent jamais sur le territoire adverse.',
      keyTakeaway: 'Circuit fermé de 16 fosses exclusif à chaque joueur.',
      visualGraphic: (
        <div className="p-3 rounded-xl bg-[#f5ecdf] border-2 border-amber-900/30 flex items-center justify-center gap-3 text-xs font-mono font-black text-amber-950">
          <span>Défense: A0 → A7</span>
          <span>➜</span>
          <span>Attaque: A15 → A8</span>
          <span>➜</span>
          <span>(Boucle ↺)</span>
        </div>
      ),
    },
    {
      title: '4. Semis en Cascade (Relais)',
      category: 'Délai et Relais',
      icon: <Sparkles className="w-5 h-5 text-blue-800" />,
      content:
        'En Phase 1, choisissez une fosse d’au moins 2 graines. Ramassez-les et semez une graine par fosse. Si la dernière graine tombe dans une fosse déjà occupée, ramassez tout et poursuivez le semis sans passer la main !',
      keyTakeaway: 'Tombé dans une fosse occupée ? Reprenez tout et continuez !',
      visualGraphic: (
        <div className="p-3 rounded-xl bg-blue-100 border-2 border-blue-500 text-blue-950 text-xs font-bold">
          Dernière graine dans une fosse contenant 2 pièces (total 3) ➔ Reprise immédiate des 3 pièces pour continuer le semis.
        </div>
      ),
    },
    {
      title: '5. Capture des Pièces Adverses',
      category: 'Règles de Capture',
      icon: <Swords className="w-5 h-5 text-rose-800" />,
      content:
        'La capture survient quand la dernière graine atterrit dans une fosse d’ATTAQUE qui était VIDE. Si la fosse adverse en face contient des pièces, elles sont toutes capturées (attaque et défense).',
      keyTakeaway: 'Atterrissage en fosse d’attaque vide + pièces ennemies en face = CAPTURE !',
      visualGraphic: (
        <div className="p-3 rounded-xl bg-rose-100 border-2 border-rose-500 text-rose-950 text-xs font-mono font-bold">
          <div>[B-Défense: B2 (2)] ➔ CAPTURÉE !</div>
          <div>[B-Attaque: B10 (3)] ➔ CAPTURÉE !</div>
          <div className="text-amber-950 mt-1 font-black">▲ Vis-à-vis: A-Attaque A10 (atterri en fosse vide)</div>
        </div>
      ),
    },
    {
      title: '6. Fin de Tour en Défense',
      category: 'Sécurité Défensive',
      icon: <Shield className="w-5 h-5 text-emerald-800" />,
      content:
        'Si la dernière graine tombe dans une fosse de DÉFENSE vide, le coup s’achève en sécurité sans capture. Le tour passe à l’adversaire.',
      keyTakeaway: 'Atterrissage en défense vide = fin de tour sécurisée.',
      visualGraphic: (
        <div className="p-3 rounded-xl bg-emerald-100 border-2 border-emerald-500 text-emerald-950 text-xs font-bold">
          Dernière graine en A3 (défense vide) ➔ Fin pacifique du tour de A. Début du tour de B.
        </div>
      ),
    },
    {
      title: '7. Graines Uniques & Victoire',
      category: 'Fin de Partie',
      icon: <Award className="w-5 h-5 text-amber-800" />,
      content:
        'Quand un joueur n’a plus que des graines isolées (1 par fosse), il passe en Phase 2 et peut déplacer des graines uniques pour se regrouper. La victoire est obtenue en éliminant toutes les graines adverses ou en le privant de tout coup légal.',
      keyTakeaway: 'Capturez toutes les pièces adverses ou immobilisez-le pour triompher !',
      visualGraphic: (
        <div className="p-3 rounded-xl bg-amber-100 border-2 border-amber-600 text-amber-950 text-xs font-black">
          🏆 Victoire: L’adversaire atteint 0 graine ou ne possède plus aucun coup valide.
        </div>
      ),
    },
  ];

  const steps = language === 'en' ? stepsEN : language === 'fr' ? stepsFR : stepsPT;
  const currentStep = steps[currentStepIdx];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#fffdfa] border-4 border-amber-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-stone-950">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between px-6 py-4 border-b-2 border-amber-900/20 bg-[#f7ede0]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 border-2 border-amber-700 flex items-center justify-center text-amber-900 shadow-xs">
              {currentStep.icon}
            </div>
            <div>
              <div className="text-xs uppercase font-black text-amber-900 tracking-wider">
                {t.tutorialTitle} • {currentStepIdx + 1} / {steps.length}
              </div>
              <h2 className="font-black text-base sm:text-lg text-amber-950">{currentStep.title}</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-[#ede2d5] hover:bg-[#dfd0be] text-stone-900 transition-all cursor-pointer font-bold"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conteúdo do Passo */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-stone-950 font-bold leading-relaxed">{currentStep.content}</p>

          {/* Gráfico visual */}
          <div className="my-3">{currentStep.visualGraphic}</div>

          {/* Regra de Ouro / Ponto Chave */}
          <div className="p-3.5 rounded-xl bg-amber-100 border-2 border-amber-600 text-amber-950 text-xs font-black flex items-center gap-2">
            <span className="text-amber-800 font-black">★</span>
            <span>{currentStep.keyTakeaway}</span>
          </div>
        </div>

        {/* Rodapé com Navegação */}
        <div className="px-6 py-4 border-t-2 border-amber-900/20 bg-[#f7ede0] flex items-center justify-between">
          <button
            onClick={() => setCurrentStepIdx(prev => Math.max(0, prev - 1))}
            disabled={currentStepIdx === 0}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#ede2d5] hover:bg-white text-stone-950 text-xs font-black cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed border-2 border-amber-900/30"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{language === 'en' ? 'Previous' : language === 'fr' ? 'Précédent' : 'Anterior'}</span>
          </button>

          <span className="text-xs font-mono font-black text-amber-950">
            {currentStepIdx + 1} / {steps.length}
          </span>

          {currentStepIdx < steps.length - 1 ? (
            <button
              onClick={() => setCurrentStepIdx(prev => Math.min(steps.length - 1, prev + 1))}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-600 hover:to-amber-800 text-amber-50 text-xs font-black cursor-pointer transition-all border-2 border-amber-600 shadow-xs"
            >
              <span>{language === 'en' ? 'Next' : language === 'fr' ? 'Suivant' : 'Próximo'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-700 to-emerald-900 hover:from-emerald-600 hover:to-emerald-800 text-white text-xs font-black cursor-pointer transition-all border-2 border-emerald-600 shadow-xs"
            >
              {t.startPlayingBtn}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
