import React from 'react';
import { RotateCcw, Volume2, VolumeX, Lightbulb, Settings, BookOpen, ShieldCheck, PlayCircle, Award } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface GameControlsProps {
  canUndo: boolean;
  soundEnabled: boolean;
  showHints: boolean;
  invariantStatus: { valid: boolean; totalSeeds: number; message: string };
  onUndo: () => void;
  onRestart: () => void;
  onToggleSound: () => void;
  onToggleHints: () => void;
  onOpenRules: () => void;
  onOpenDossier: () => void;
  onOpenSettings: () => void;
  onOpenTests: () => void;
  onOpenTutorial: () => void;
}

export const GameControls: React.FC<GameControlsProps> = ({
  canUndo,
  soundEnabled,
  showHints,
  invariantStatus,
  onUndo,
  onRestart,
  onToggleSound,
  onToggleHints,
  onOpenRules,
  onOpenDossier,
  onOpenSettings,
  onOpenTests,
  onOpenTutorial,
}) => {
  const { t } = useLanguage();

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-2 px-2 py-1 text-xs">
      {/* Botões de Ação de Jogo */}
      <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
        <button
          type="button"
          onClick={onUndo}
          disabled={!canUndo}
          title={`${t.undoBtn} (U)`}
          className={`
            flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 font-black transition-all shadow-xs text-xs sm:text-sm
            ${
              canUndo
                ? 'bg-[#fffdfa] hover:bg-white text-stone-950 border-amber-900/40 active:scale-95 cursor-pointer'
                : 'bg-amber-950/5 text-amber-950/40 border-amber-900/15 cursor-not-allowed'
            }
          `}
        >
          <RotateCcw className="w-4 h-4 text-amber-800" />
          <span>{t.undoBtn}</span>
        </button>

        <button
          type="button"
          onClick={onRestart}
          title={`${t.newGameBtn} (R)`}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#fffdfa] hover:bg-white text-stone-950 border-2 border-amber-900/40 active:scale-95 cursor-pointer transition-all shadow-xs font-black text-xs sm:text-sm"
        >
          <PlayCircle className="w-4 h-4 text-amber-800" />
          <span>{t.newGameBtn}</span>
        </button>

        <button
          type="button"
          onClick={onToggleHints}
          title={showHints ? 'Desativar dicas' : 'Ativar dicas'}
          className={`
            flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 font-black transition-all cursor-pointer shadow-xs text-xs sm:text-sm
            ${
              showHints
                ? 'bg-amber-100 text-amber-950 border-amber-600'
                : 'bg-[#fffdfa] hover:bg-white text-stone-950 border-amber-900/40'
            }
          `}
        >
          <Lightbulb className="w-4 h-4 text-amber-700" />
          <span>{t.hintsBtn} {showHints ? 'On' : 'Off'}</span>
        </button>

        <button
          type="button"
          onClick={onToggleSound}
          title={soundEnabled ? `${t.muteBtn} (M)` : `${t.soundBtn} (M)`}
          className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-[#fffdfa] hover:bg-white text-stone-950 border-2 border-amber-900/40 cursor-pointer transition-all flex items-center gap-1.5 shadow-xs font-black text-xs sm:text-sm"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-700" /> : <VolumeX className="w-4 h-4 text-stone-600" />}
          <span className="hidden sm:inline">{soundEnabled ? t.soundBtn : t.muteBtn}</span>
        </button>
      </div>

      {/* Auditoria de Invariantes & Acesso a Ferramentas */}
      <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
        {/* Selo de Invariantes Conservadas */}
        <div
          title={invariantStatus.message}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-xl border-2 font-mono text-xs font-black shadow-xs ${
            invariantStatus.valid
              ? 'bg-emerald-100 border-emerald-600 text-emerald-950'
              : 'bg-rose-100 border-rose-600 text-rose-950 animate-pulse'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>{invariantStatus.totalSeeds} {t.conservedSeedsTag.split(' ')[0]}</span>
        </div>

        <button
          type="button"
          onClick={onOpenTutorial}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#fffdfa] hover:bg-white text-amber-950 border-2 border-amber-900/40 cursor-pointer transition-all shadow-xs font-black text-xs sm:text-sm"
        >
          <Award className="w-4 h-4 text-amber-800" />
          <span className="hidden md:inline">{t.tutorialBtn}</span>
        </button>

        <button
          type="button"
          onClick={onOpenDossier}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#fffdfa] hover:bg-white text-stone-950 border-2 border-amber-900/40 cursor-pointer transition-all shadow-xs font-black text-xs sm:text-sm"
        >
          <BookOpen className="w-4 h-4 text-amber-800" />
          <span>{t.rulesDossierBtn}</span>
        </button>

        <button
          type="button"
          onClick={onOpenTests}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#fffdfa] hover:bg-white text-stone-950 border-2 border-amber-900/40 cursor-pointer transition-all shadow-xs font-black text-xs sm:text-sm"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>{t.testsBtn}</span>
        </button>

        <button
          type="button"
          onClick={onOpenSettings}
          title={t.settingsBtn}
          className="p-1.5 rounded-xl bg-[#fffdfa] hover:bg-white text-stone-950 border-2 border-amber-900/40 cursor-pointer transition-all shadow-xs"
        >
          <Settings className="w-4.5 h-4.5 text-amber-950" />
        </button>
      </div>
    </div>
  );
};
