import React, { useState } from 'react';
import { GameMode, AIDifficulty } from '../engine/types';
import { useLanguage } from '../i18n/LanguageContext';
import { LanguageSelector } from './LanguageSelector';
import { Users, Bot, BookOpen, ShieldCheck, Image as ImageIcon, Sun, Compass } from 'lucide-react';

interface TitleScreenProps {
  onStartGame: (mode: GameMode, difficulty?: AIDifficulty) => void;
  onOpenTutorial: () => void;
  onOpenDossier: () => void;
  onOpenTests: () => void;
  onOpenAuthenticShowcase: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onStartGame,
  onOpenTutorial,
  onOpenDossier,
  onOpenTests,
  onOpenAuthenticShowcase,
}) => {
  const { t } = useLanguage();
  const [naturalGroundTone, setNaturalGroundTone] = useState<'golden_sand' | 'warm_clay'>('golden_sand');

  const isGoldenSand = naturalGroundTone === 'golden_sand';

  return (
    <div
      className={`relative min-h-screen w-full flex flex-col items-center justify-between p-4 sm:p-8 select-none overflow-hidden transition-colors duration-700 ${
        isGoldenSand
          ? 'bg-gradient-to-b from-[#f5e6d4] via-[#e8d0b6] to-[#d2ad8a] text-stone-950'
          : 'bg-gradient-to-b from-[#ecdbca] via-[#dbbca0] to-[#be9471] text-stone-950'
      }`}
    >
      {/* Imagem de Fundo Autêntica do Solo de Areia Natural da Savana Moçambicana */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <img
          src="/src/assets/images/mozambique_natural_sand_ground_1792692127524.jpg"
          alt="Solo e areia natural moçambicana da savana"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover scale-105 filter brightness-105 contrast-110 opacity-35 mix-blend-multiply"
        />
        <img
          src="/src/assets/images/african_ntxuva_board_1792678914279.jpg"
          alt="Textura de madeira tradicional"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover opacity-10 mix-blend-overlay filter blur-[1px]"
        />
      </div>

      {/* Iluminação Quente da Savana */}
      <div className="absolute -top-32 -right-32 w-[650px] h-[650px] bg-gradient-to-bl from-amber-300/40 via-orange-200/25 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-[600px] h-[600px] bg-gradient-to-tr from-amber-600/20 via-orange-400/15 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Topo / Status da Edição, Seletor de Idioma e Ambiente Natural */}
      <header className="relative z-10 w-full max-w-4xl flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 text-amber-950 font-black tracking-wider">
          <span className="w-3 h-3 rounded-full bg-amber-800 shadow-xs animate-pulse" />
          <span className="uppercase text-xs sm:text-sm tracking-widest font-mono font-black drop-shadow-2xs">
            {t.naturalGroundLabel}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Seletor de Idioma (PT / EN / FR) */}
          <LanguageSelector />

          {/* Alternador de Tonalidade Natural do Solo */}
          <div className="flex items-center bg-[#fffdfa]/95 backdrop-blur-md p-1 rounded-xl border-2 border-amber-900/30 text-xs shadow-xs">
            <button
              type="button"
              onClick={() => setNaturalGroundTone('golden_sand')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-black transition-all cursor-pointer ${
                isGoldenSand
                  ? 'bg-amber-950 text-amber-100 shadow-xs'
                  : 'text-amber-950/80 hover:text-amber-950 hover:bg-amber-100/60'
              }`}
            >
              <Sun className="w-3.5 h-3.5 text-amber-600" />
              <span>{t.naturalGroundSavanna}</span>
            </button>
            <button
              type="button"
              onClick={() => setNaturalGroundTone('warm_clay')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-black transition-all cursor-pointer ${
                !isGoldenSand
                  ? 'bg-amber-950 text-amber-100 shadow-xs'
                  : 'text-amber-950/80 hover:text-amber-950 hover:bg-amber-100/60'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-amber-700" />
              <span>{t.naturalGroundClay}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onOpenAuthenticShowcase}
            className="px-3 py-1.5 rounded-xl bg-[#fffdfa]/95 hover:bg-white border-2 border-amber-900/30 text-xs text-amber-950 font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <ImageIcon className="w-3.5 h-3.5 text-amber-800" />
            <span className="hidden sm:inline">{t.authenticShowcaseBtn}</span>
            <span className="sm:hidden">Fotos</span>
          </button>
        </div>
      </header>

      {/* Hero Centerpiece: SVG Title Lockup com Alta Visibilidade */}
      <main className="relative z-10 my-auto flex flex-col items-center text-center max-w-2xl px-4 py-3">
        {/* SVG Title Lockup */}
        <div className="mb-2">
          <svg
            className="w-72 sm:w-88 md:w-104 h-auto drop-shadow-[0_8px_16px_rgba(92,38,5,0.3)]"
            viewBox="0 0 400 110"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="titleEarthGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#381302" />
                <stop offset="50%" stopColor="#632808" />
                <stop offset="100%" stopColor="#8c330c" />
              </linearGradient>
              <filter id="naturalShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#451a03" floodOpacity="0.5" />
              </filter>
            </defs>

            {/* Linha de semeadura decorativa */}
            <path
              d="M 40 15 L 200 5 L 360 15"
              stroke="#8c330c"
              strokeWidth="3"
              strokeDasharray="6 4"
              opacity="0.9"
            />
            <circle cx="200" cy="5" r="5" fill="#a14311" />

            <text
              x="200"
              y="65"
              textAnchor="middle"
              fontFamily="system-ui, -apple-system, sans-serif"
              fontSize="54"
              fontWeight="900"
              letterSpacing="4"
              fill="url(#titleEarthGlow)"
              filter="url(#naturalShadow)"
            >
              {t.gameTitle}
            </text>

            <text
              x="200"
              y="95"
              textAnchor="middle"
              fontFamily="ui-monospace, monospace"
              fontSize="14"
              fontWeight="900"
              letterSpacing="8"
              fill="#2e1003"
              opacity="1"
            >
              {t.gameSubtitle}
            </text>
          </svg>
        </div>

        {/* Card de Apresentação com Imagem Autêntica Reduzida */}
        <div
          className="mb-5 relative rounded-2xl overflow-hidden border-2 border-amber-900/40 shadow-xl max-w-sm mx-auto group cursor-pointer bg-[#fffdfa]/60 backdrop-blur-xs"
          onClick={onOpenAuthenticShowcase}
        >
          <img
            src="/src/assets/images/african_ntxuva_board_1792678914279.jpg"
            alt="Tabuleiro de Madeira com Orifícios e Sementes Reais"
            referrerPolicy="no-referrer"
            className="w-full h-32 object-cover group-hover:scale-105 transition-all duration-500 filter brightness-95"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-900/30 to-transparent flex items-end p-2.5">
            <span className="text-xs text-amber-100 font-extrabold flex items-center gap-1.5 drop-shadow">
              <span>{t.boardPhotoCaption}</span>
            </span>
          </div>
        </div>

        {/* Descrição com Contraste Elevado */}
        <p className="text-sm sm:text-base text-stone-950 font-bold max-w-lg mb-6 leading-relaxed drop-shadow-2xs">
          {t.gameTagline}
        </p>

        {/* Menu de Inicialização Rápida com Letras Grandes e Nítidas */}
        <div className="w-full max-w-md flex flex-col gap-3">
          {/* Jogar Contra Computador */}
          <button
            type="button"
            onClick={() => onStartGame('ai', 'medium')}
            className="group relative w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-800 via-amber-900 to-amber-950 hover:from-amber-700 hover:to-amber-900 text-amber-50 font-black text-base sm:text-lg shadow-[0_10px_25px_rgba(92,38,5,0.4)] transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-3 border-2 border-amber-600/50"
          >
            <Bot className="w-6 h-6 text-amber-200" />
            <span className="tracking-wide">{t.playVsAI}</span>
            <span className="text-xs font-mono bg-black/40 px-2.5 py-1 rounded-md text-amber-200 border border-amber-600/50 font-bold">
              {t.pressEnterSpace}
            </span>
          </button>

          {/* Jogar 1 vs 1 Local */}
          <button
            type="button"
            onClick={() => onStartGame('pvp')}
            className="w-full py-3.5 px-6 rounded-2xl bg-[#fffdfa] hover:bg-white border-2 border-amber-900/35 text-amber-950 font-black text-sm sm:text-base shadow-md transition-all duration-200 hover:scale-[1.01] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-3 hover:border-amber-900/50"
          >
            <Users className="w-5 h-5 text-amber-900" />
            <span>{t.playLocalPvP}</span>
          </button>

          {/* Atalhos Secundários: Tutorial, Dossiê e Testes */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            <button
              type="button"
              onClick={onOpenTutorial}
              className="py-3 px-2 rounded-xl bg-[#fffdfa] hover:bg-white border-2 border-amber-900/30 text-xs font-black text-amber-950 transition-all flex flex-col items-center gap-1.5 cursor-pointer shadow-xs hover:shadow-md"
            >
              <BookOpen className="w-4.5 h-4.5 text-amber-800" />
              <span>{t.learnRulesBtn}</span>
            </button>

            <button
              type="button"
              onClick={onOpenDossier}
              className="py-3 px-2 rounded-xl bg-[#fffdfa] hover:bg-white border-2 border-amber-900/30 text-xs font-black text-amber-950 transition-all flex flex-col items-center gap-1.5 cursor-pointer shadow-xs hover:shadow-md"
            >
              <ImageIcon className="w-4.5 h-4.5 text-amber-900" />
              <span>{t.dossierPhotosBtn}</span>
            </button>

            <button
              type="button"
              onClick={onOpenTests}
              className="py-3 px-2 rounded-xl bg-[#fffdfa] hover:bg-white border-2 border-amber-900/30 text-xs font-black text-emerald-950 transition-all flex flex-col items-center gap-1.5 cursor-pointer shadow-xs hover:shadow-md"
            >
              <ShieldCheck className="w-4.5 h-4.5 text-emerald-800" />
              <span>{t.testRunnerBtn}</span>
            </button>
          </div>
        </div>
      </main>

      {/* Rodapé com Atalhos de Teclado em Alta Visibilidade */}
      <footer className="relative z-10 w-full max-w-3xl flex items-center justify-center text-xs font-mono font-bold text-amber-950 py-2.5 border-t-2 border-amber-900/25">
        <span>{t.menuFooterHints}</span>
      </footer>
    </div>
  );
};
