import React from 'react';
import { GameConfig, AIDifficulty } from '../engine/types';
import { ALTERNATE_PROFILES } from '../rules/ruleProfile';
import { useLanguage } from '../i18n/LanguageContext';
import { LanguageSelector } from './LanguageSelector';
import { X, Settings, Zap } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  config: GameConfig;
  onUpdateConfig: (newConfig: Partial<GameConfig>) => void;
  onClose: () => void;
  onRestartWithNewRules: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  config,
  onUpdateConfig,
  onClose,
  onRestartWithNewRules,
}) => {
  const { t } = useLanguage();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#fffdfa] border-4 border-amber-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-stone-950">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between px-6 py-4 border-b-2 border-amber-900/20 bg-[#f7ede0]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 border-2 border-amber-700 flex items-center justify-center text-amber-900 shadow-xs">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-black text-lg text-amber-950">{t.settingsTitle}</h2>
              <p className="text-xs text-stone-800 font-bold">Variantes & Preferências de Jogo</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-[#ede2d5] hover:bg-[#dfd0be] text-stone-900 transition-all cursor-pointer font-bold"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo de Opções */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs font-bold">
          {/* Seletor de Idioma (PT / EN / FR) */}
          <div className="space-y-1.5 p-3 rounded-2xl bg-[#f5ebe0] border-2 border-amber-900/25">
            <label className="font-black text-sm text-amber-950 block">{t.languageSelectLabel}:</label>
            <LanguageSelector />
          </div>

          {/* Modo de Jogo */}
          <div className="space-y-1.5">
            <label className="font-black text-sm text-stone-950 block">Modo de Jogo:</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onUpdateConfig({ mode: 'pvp' })}
                className={`p-3 rounded-xl border-2 text-left cursor-pointer transition-all ${
                  config.mode === 'pvp'
                    ? 'bg-amber-100 border-amber-700 text-amber-950 font-black shadow-xs'
                    : 'bg-[#faf5ee] border-amber-900/20 text-stone-800 hover:bg-white'
                }`}
              >
                {t.playLocalPvP}
                <span className="block text-[11px] font-bold text-stone-700 mt-0.5">
                  1 vs 1 no mesmo dispositivo
                </span>
              </button>

              <button
                type="button"
                onClick={() => onUpdateConfig({ mode: 'ai' })}
                className={`p-3 rounded-xl border-2 text-left cursor-pointer transition-all ${
                  config.mode === 'ai'
                    ? 'bg-blue-100 border-blue-700 text-blue-950 font-black shadow-xs'
                    : 'bg-[#faf5ee] border-amber-900/20 text-stone-800 hover:bg-white'
                }`}
              >
                {t.playVsAI}
                <span className="block text-[11px] font-bold text-stone-700 mt-0.5">
                  Desafie a IA offline
                </span>
              </button>
            </div>
          </div>

          {/* Dificuldade da IA */}
          {config.mode === 'ai' && (
            <div className="space-y-1.5 pt-2 border-t-2 border-amber-900/15">
              <label className="font-black text-sm text-stone-950 block">{t.aiDifficultyLabel}:</label>
              <div className="grid grid-cols-3 gap-2 font-black">
                {(['easy', 'medium', 'hard'] as AIDifficulty[]).map(diff => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => onUpdateConfig({ aiDifficulty: diff })}
                    className={`py-2 px-3 rounded-xl border-2 text-center cursor-pointer capitalize transition-all ${
                      config.aiDifficulty === diff
                        ? 'bg-blue-100 border-blue-600 text-blue-950 font-black shadow-xs'
                        : 'bg-[#faf5ee] border-amber-900/20 text-stone-800 hover:bg-white'
                    }`}
                  >
                    {diff === 'easy' ? t.diffEasy : diff === 'medium' ? t.diffMedium : t.diffHard}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Perfil de Regras do Ntxuva */}
          <div className="space-y-1.5 pt-2 border-t-2 border-amber-900/15">
            <label className="font-black text-sm text-stone-950 block">{t.ruleProfileLabel}:</label>
            <div className="space-y-2">
              {ALTERNATE_PROFILES.map(prof => (
                <button
                  key={prof.id}
                  type="button"
                  onClick={() => {
                    onUpdateConfig({ profile: prof });
                    onRestartWithNewRules();
                  }}
                  className={`w-full p-3 rounded-xl border-2 text-left cursor-pointer transition-all ${
                    config.profile.id === prof.id
                      ? 'bg-amber-100 border-amber-700 text-amber-950 font-black shadow-xs'
                      : 'bg-[#faf5ee] border-amber-900/20 text-stone-800 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-sm">{prof.name}</span>
                    <span className="text-xs uppercase font-mono px-2 py-0.5 rounded-md bg-amber-950 text-amber-100 font-bold">
                      {prof.culturalStatus}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-stone-700 mt-0.5">
                    {prof.variantSubtitle}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Velocidade da Animação */}
          <div className="space-y-1.5 pt-2 border-t-2 border-amber-900/15">
            <label className="font-black text-sm text-stone-950 block flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-800" />
              <span>{t.animSpeedLabel}:</span>
            </label>
            <div className="grid grid-cols-4 gap-2 font-black">
              {(['slow', 'normal', 'fast', 'instant'] as const).map(speed => (
                <button
                  key={speed}
                  type="button"
                  onClick={() => onUpdateConfig({ animationSpeed: speed })}
                  className={`py-2 rounded-xl border-2 text-center capitalize cursor-pointer transition-all text-xs ${
                    config.animationSpeed === speed
                      ? 'bg-amber-800 text-amber-50 font-black border-amber-950 shadow-xs'
                      : 'bg-[#faf5ee] border-amber-900/20 text-stone-800 hover:bg-white'
                  }`}
                >
                  {speed === 'slow'
                    ? t.speedSlow
                    : speed === 'normal'
                    ? t.speedNormal
                    : speed === 'fast'
                    ? t.speedFast
                    : t.speedInstant}
                </button>
              ))}
            </div>
          </div>

          {/* Preferências Visuais e Áudio */}
          <div className="space-y-2 pt-2 border-t-2 border-amber-900/15">
            <label className="flex items-center justify-between cursor-pointer p-3 rounded-xl bg-[#faf5ee] border-2 border-amber-900/20 hover:bg-white">
              <span className="text-stone-950 font-black text-xs sm:text-sm">{t.showCoordsLabel}</span>
              <input
                type="checkbox"
                checked={config.showCoordinates}
                onChange={e => onUpdateConfig({ showCoordinates: e.target.checked })}
                className="w-5 h-5 accent-amber-800 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer p-3 rounded-xl bg-[#faf5ee] border-2 border-amber-900/20 hover:bg-white">
              <span className="text-stone-950 font-black text-xs sm:text-sm">{t.audioEffectsLabel}</span>
              <input
                type="checkbox"
                checked={config.soundEnabled}
                onChange={e => onUpdateConfig({ soundEnabled: e.target.checked })}
                className="w-5 h-5 accent-amber-800 cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Rodapé */}
        <div className="px-6 py-4 border-t-2 border-amber-900/20 bg-[#f7ede0] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-600 hover:to-amber-800 text-amber-50 font-black cursor-pointer transition-all shadow-md text-sm border-2 border-amber-600"
          >
            {t.closeBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
