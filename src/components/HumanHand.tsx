import React, { useMemo } from 'react';
import { Player } from '../engine/types';

interface HumanHandProps {
  targetPitId: string | null;
  player: Player;
  stepType: 'pickup' | 'sow' | 'relay_pickup' | 'capture' | 'turn_end' | null;
  seedsInHand: number | null;
  speedMs: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
  isVisible: boolean;
}

export const HumanHand: React.FC<HumanHandProps> = ({
  targetPitId,
  player,
  stepType,
  seedsInHand,
  speedMs,
  containerRef,
  isVisible,
}) => {
  // Calcular posição relativa do centro da cova alvo dentro do contentor do tabuleiro
  const position = useMemo(() => {
    if (!targetPitId || !containerRef.current) return null;
    const container = containerRef.current;
    const pitEl = container.querySelector<HTMLElement>(`[data-pit-id="${targetPitId}"]`);
    if (!pitEl) return null;

    const pRect = pitEl.getBoundingClientRect();
    const cRect = container.getBoundingClientRect();

    const x = pRect.left + pRect.width / 2 - cRect.left;
    const y = pRect.top + pRect.height / 2 - cRect.top;

    // Calcular coluna para inclinar ligeiramente o antebraço em direção ao centro
    const colIndex = parseInt(targetPitId.replace(/^[AB]/, ''), 10) % 8;
    // Inclinacao subtil: col 0 a 7 varia de -12deg a +12deg
    const angleTilt = (colIndex - 3.5) * 2.8;

    return { x, y, angleTilt };
  }, [targetPitId, containerRef]);

  if (!isVisible || !position || !targetPitId) {
    return null;
  }

  const isPlayerA = player === 'A';
  const baseRotation = isPlayerA ? position.angleTilt : 180 - position.angleTilt;
  const isCapturing = stepType === 'capture';
  const isPickup = stepType === 'pickup' || stepType === 'relay_pickup';
  const isSow = stepType === 'sow';

  // Sementes visíveis na palma da mão
  const displaySeedsCount = Math.min(seedsInHand || 0, 7);

  return (
    <div
      className="absolute top-0 left-0 pointer-events-none z-50 select-none will-change-transform"
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        transition: `transform ${Math.max(40, speedMs * 0.9)}ms cubic-bezier(0.25, 1, 0.4, 1)`,
      }}
    >
      {/* Sombra orgânica projectada pela mão na madeira do tabuleiro */}
      <div
        className="absolute w-24 h-24 -left-12 -top-12 rounded-full pointer-events-none opacity-45 blur-md"
        style={{
          background: 'radial-gradient(circle, rgba(30,12,4,0.75) 0%, rgba(20,8,3,0.3) 50%, transparent 70%)',
          transform: isPlayerA ? 'translate(8px, 16px)' : 'translate(-8px, -16px)',
        }}
      />

      {/* Mão Humana Realista esculpida em SVG com tons quentes de melanina africana */}
      <div
        className="relative pointer-events-none transition-transform duration-150"
        style={{
          transform: `rotate(${baseRotation}deg) ${
            isPickup
              ? 'scale(0.94) translateY(6px)'
              : isCapturing
              ? 'scale(1.1) translateY(-4px)'
              : isSow
              ? 'scale(1.02)'
              : 'scale(1)'
          }`,
          transformOrigin: '50% 30%',
        }}
      >
        <svg
          width="130"
          height="180"
          viewBox="0 0 130 180"
          className="overflow-visible -translate-x-[65px] -translate-y-[45px] drop-shadow-xl"
        >
          <defs>
            {/* Gradiente de pele com tom de melanina africana e iluminação dourada suave */}
            <linearGradient id="africanSkinGrad" x1="20%" y1="0%" x2="80%" y2="100%">
              <stop offset="0%" stopColor="#7a3d1b" />
              <stop offset="35%" stopColor="#8d4924" />
              <stop offset="70%" stopColor="#693315" />
              <stop offset="100%" stopColor="#4f240d" />
            </linearGradient>

            {/* Destaque de luz nos nós dos dedos e dorso da mão */}
            <linearGradient id="skinHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#a35b31" />
              <stop offset="50%" stopColor="#bd7549" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#7a3d1b" />
            </linearGradient>

            {/* Palma e pregas interiores */}
            <linearGradient id="palmInner" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#9c542a" />
              <stop offset="50%" stopColor="#b3693d" />
              <stop offset="100%" stopColor="#6e3516" />
            </linearGradient>

            {/* Unhas naturais com reflexo suave */}
            <linearGradient id="nailGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ca8764" />
              <stop offset="60%" stopColor="#e3a785" />
              <stop offset="100%" stopColor="#a96440" />
            </linearGradient>

            {/* Casca de semente de Canhu (marula) */}
            <radialGradient id="canhuSeedGrad" cx="35%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="35%" stopColor="#d97706" />
              <stop offset="75%" stopColor="#92400e" />
              <stop offset="100%" stopColor="#451a03" />
            </radialGradient>
          </defs>

          {/* 1. Antebraço e Pulso estendendo-se em direção à cova */}
          <path
            d="M 46 180 L 48 115 C 48 108 50 102 53 96 L 77 96 C 80 102 82 108 82 115 L 84 180 Z"
            fill="url(#africanSkinGrad)"
            stroke="#381909"
            strokeWidth="1.2"
          />
          {/* Sombras anatómicas do pulso */}
          <path
            d="M 50 120 C 58 124 72 124 80 120"
            fill="none"
            stroke="#3a1908"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.45"
          />

          {/* 2. Dorso / Palma da mão côncava (formato em concha que recolhe e semeia sementes) */}
          <path
            d="M 40 96 C 36 82 38 68 44 54 C 47 48 55 42 65 42 C 75 42 83 48 86 54 C 92 68 94 82 90 96 C 85 104 45 104 40 96 Z"
            fill="url(#africanSkinGrad)"
            stroke="#381909"
            strokeWidth="1.2"
          />

          {/* Iluminação suave no dorso */}
          <path
            d="M 50 88 C 48 76 52 64 65 60 C 78 64 82 76 80 88"
            fill="none"
            stroke="url(#skinHighlight)"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.6"
          />

          {/* 3. Dedos arqueados em concha sobre a cova (Polegar, Indicador, Médio, Anelar, Mindinho) */}

          {/* Dedo Mindinho (lado esquerdo) */}
          <path
            d="M 39 74 C 33 66 31 56 34 46 C 35 43 38 43 40 46 C 43 52 44 60 45 68 Z"
            fill="url(#africanSkinGrad)"
            stroke="#381909"
            strokeWidth="1"
          />
          <ellipse cx="36" cy="46" rx="2.2" ry="3" fill="url(#nailGrad)" />

          {/* Dedo Anelar */}
          <path
            d="M 45 64 C 42 52 42 40 46 28 C 47 25 51 25 53 28 C 55 36 55 46 54 58 Z"
            fill="url(#africanSkinGrad)"
            stroke="#381909"
            strokeWidth="1"
          />
          <ellipse cx="48" cy="28" rx="2.5" ry="3.5" fill="url(#nailGrad)" />

          {/* Dedo Médio (o mais longo, curvado sobre o centro do orifício) */}
          <path
            d="M 56 56 C 55 44 56 30 63 18 C 65 15 69 15 71 18 C 74 28 73 40 70 54 Z"
            fill="url(#africanSkinGrad)"
            stroke="#381909"
            strokeWidth="1.2"
          />
          <ellipse cx="66" cy="18" rx="3" ry="4" fill="url(#nailGrad)" />

          {/* Dedo Indicador (orientado para libertar ou apanhar a semente) */}
          <path
            d="M 72 58 C 75 48 78 36 84 26 C 86 23 90 24 91 27 C 91 38 88 50 83 62 Z"
            fill="url(#africanSkinGrad)"
            stroke="#381909"
            strokeWidth="1"
          />
          <ellipse cx="87" cy="27" rx="2.8" ry="3.8" fill="url(#nailGrad)" />

          {/* Polegar (dobrado em pinça com o indicador para guiar sementes) */}
          <path
            d="M 88 82 C 96 74 102 65 100 52 C 99 48 95 48 93 52 C 89 60 85 70 82 78 Z"
            fill="url(#africanSkinGrad)"
            stroke="#381909"
            strokeWidth="1"
          />
          <ellipse cx="97" cy="51" rx="2.8" ry="3.8" fill="url(#nailGrad)" />

          {/* Vincos das articulações e nós dos dedos */}
          <path d="M 46 36 C 48 37 51 37 53 36" stroke="#3d1b09" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
          <path d="M 62 26 C 65 27 69 27 72 26" stroke="#3d1b09" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
          <path d="M 80 34 C 83 35 87 35 89 34" stroke="#3d1b09" strokeWidth="1" strokeLinecap="round" opacity="0.6" />

          {/* 4. Sementes reais de canhu aninhadas na concha da mão */}
          {seedsInHand !== null && seedsInHand > 0 && (
            <g className="seeds-in-cupped-hand" transform="translate(65, 45)">
              {Array.from({ length: displaySeedsCount }).map((_, i) => {
                const offsets = [
                  { x: -3, y: -2, r: 12 },
                  { x: 4, y: 3, r: 45 },
                  { x: -8, y: 5, r: -20 },
                  { x: 3, y: -8, r: 80 },
                  { x: -5, y: -9, r: -50 },
                  { x: 6, y: -4, r: 30 },
                  { x: 0, y: 7, r: 15 },
                ];
                const off = offsets[i % offsets.length];
                return (
                  <ellipse
                    key={i}
                    cx={off.x}
                    cy={off.y}
                    rx="4.8"
                    ry="3.8"
                    transform={`rotate(${off.r} ${off.x} ${off.y})`}
                    fill="url(#canhuSeedGrad)"
                    stroke="#2e1406"
                    strokeWidth="0.6"
                    className="drop-shadow-xs"
                  />
                );
              })}
            </g>
          )}

          {/* Animação de gota da semente a cair no orifício durante 'sow' */}
          {isSow && (
            <g className="animate-bounce" transform="translate(65, 12)">
              <ellipse cx="0" cy="0" rx="4.5" ry="3.5" fill="url(#canhuSeedGrad)" stroke="#2e1406" strokeWidth="0.6" />
              <circle cx="-1" cy="-1" r="1" fill="#fff" opacity="0.5" />
            </g>
          )}

          {/* Efeito cintilante de captura de sementes adversárias */}
          {isCapturing && (
            <g transform="translate(65, 25)">
              <circle cx="0" cy="0" r="16" fill="none" stroke="#f43f5e" strokeWidth="2.5" opacity="0.8" className="animate-ping" />
              <circle cx="0" cy="0" r="10" fill="rgba(244, 63, 94, 0.25)" stroke="#fb7185" strokeWidth="1.5" />
            </g>
          )}
        </svg>
      </div>

      {/* Crachá flutuante dinâmico junto ao pulso com contagem de sementes e ação */}
      <div
        className="absolute z-60 -left-14 -top-6 flex items-center gap-1.5 px-2.5 py-1 rounded-full font-sans font-black text-xs shadow-xl border-2 pointer-events-none whitespace-nowrap animate-in fade-in zoom-in-95 duration-100"
        style={{
          background: isCapturing
            ? 'linear-gradient(135deg, #e11d48, #9f1239)'
            : isPickup
            ? 'linear-gradient(135deg, #d97706, #92400e)'
            : isPlayerA
            ? 'linear-gradient(135deg, #f59e0b, #b45309)'
            : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
          color: '#ffffff',
          borderColor: isCapturing ? '#fecdd3' : isPickup ? '#fef3c7' : '#ffffff',
        }}
      >
        <span className="text-sm shrink-0">
          {isCapturing ? '⚔' : isPickup ? '🤲' : '🌰'}
        </span>
        <span className="font-mono font-black text-xs tracking-tight">
          {isCapturing
            ? `+${seedsInHand || ''} Captura!`
            : isPickup
            ? `Recolhe ${seedsInHand || ''}`
            : seedsInHand !== null && seedsInHand !== undefined
            ? `${seedsInHand} na mão`
            : targetPitId}
        </span>
      </div>
    </div>
  );
};
