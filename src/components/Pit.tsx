import React from 'react';
import { PitDefinition } from '../engine/types';

interface PitProps {
  pit: PitDefinition;
  seeds: number;
  isLegal: boolean;
  isSelected: boolean;
  isSowedInTurn: boolean;
  isCapturedInTurn: boolean;
  isTargetedByOpponent: boolean;
  isCurrentPlayerPit: boolean;
  showCoordinates: boolean;
  disabled: boolean;
  isCurrentDropTarget?: boolean;
  isLastLandingPit?: boolean;
  sowStepOrder?: number | null;
  isHoveredTrajectory?: boolean;
  isHoveredLanding?: boolean;
  isHoveredCapture?: boolean;
  onClick: () => void;
  onHover?: () => void;
  onLeave?: () => void;
}

const PitComponent: React.FC<PitProps> = ({
  pit,
  seeds,
  isLegal,
  isSelected,
  isSowedInTurn,
  isCapturedInTurn,
  isTargetedByOpponent,
  isCurrentPlayerPit,
  showCoordinates,
  disabled,
  isCurrentDropTarget,
  isLastLandingPit,
  sowStepOrder,
  isHoveredTrajectory,
  isHoveredLanding,
  isHoveredCapture,
  onClick,
  onHover,
  onLeave,
}) => {
  const isAttack = pit.type === 'attack';
  const isPlayerA = pit.player === 'A';

  // Gerar sementes realistas (canhu/nozes de marula ou seixos do rio)
  const renderPebbles = () => {
    if (seeds === 0) return null;
    const count = Math.min(seeds, 8);
    const pebbles = [];

    // Disposição orgânica das sementes no fundo do orifício de madeira
    const seedPositions = [
      { x: 0, y: 0, r: 12 },
      { x: -9, y: -7, r: 48 },
      { x: 9, y: -6, r: -35 },
      { x: -7, y: 8, r: 85 },
      { x: 8, y: 8, r: -15 },
      { x: 0, y: -12, r: 140 },
      { x: 0, y: 12, r: -70 },
      { x: -11, y: 1, r: 25 },
    ];

    for (let i = 0; i < count; i++) {
      const pos = seedPositions[i % seedPositions.length];
      pebbles.push(
        <div
          key={i}
          className="absolute w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-4.5 md:h-4.5 rounded-full pointer-events-none"
          style={{
            transform: `translate(${pos.x}px, ${pos.y}px) rotate(${pos.r}deg)`,
            // Sementes estilo Canhu (nozes de marula polidas) e seixos africanos naturais
            background: isPlayerA
              ? 'radial-gradient(circle at 35% 30%, #fef08a 0%, #d97706 45%, #92400e 80%, #451a03 100%)'
              : 'radial-gradient(circle at 35% 30%, #bae6fd 0%, #3b82f6 45%, #1e40af 80%, #0f172a 100%)',
            boxShadow:
              'inset 0 1px 2px rgba(255,255,255,0.7), inset -1px -1px 2px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.7)',
            filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.6))',
          }}
        >
          {/* Brilho natural da casca polida da semente de canhu */}
          <div className="absolute top-0.5 left-1 w-1.5 h-1 rounded-full bg-white/40 blur-[0.3px]" />
        </div>
      );
    }
    return pebbles;
  };

  return (
    <button
      type="button"
      data-pit-id={pit.id}
      onClick={onClick}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      disabled={disabled || !isLegal}
      aria-label={`Casa ${pit.id}, jogador ${pit.player}, ${isAttack ? 'linha de ataque' : 'linha de defesa'}, ${seeds} sementes`}
      className={`
        relative group flex flex-col items-center justify-center
        w-11 h-11 xs:w-13 xs:h-13 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-26 xl:h-26
        shrink-0 rounded-full select-none transition-transform duration-150
        ${disabled || !isLegal ? 'cursor-default' : 'cursor-pointer hover:scale-105 active:scale-95'}
        ${isSelected ? 'ring-4 ring-amber-500 shadow-2xl z-20' : ''}
        ${isLegal && !isCurrentDropTarget ? 'ring-2 sm:ring-4 ring-amber-400 shadow-[0_0_14px_rgba(251,191,36,0.85)]' : ''}
        ${isCurrentDropTarget ? 'ring-4 ring-amber-300 shadow-[0_0_24px_rgba(251,191,36,1)] z-30 scale-105' : ''}
        ${isLastLandingPit ? 'ring-4 ring-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.9)] z-25' : ''}
        ${isHoveredLanding ? 'ring-4 ring-amber-400 shadow-[0_0_18px_rgba(251,191,36,0.9)] z-20' : ''}
        ${isHoveredTrajectory && !isHoveredLanding ? 'ring-2 ring-amber-400 bg-amber-500/20' : ''}
        ${isHoveredCapture ? 'ring-4 ring-rose-500 bg-rose-500/25 shadow-[0_0_18px_rgba(244,63,94,0.9)] z-20' : ''}
        ${isSowedInTurn && !isCurrentDropTarget && !isLastLandingPit ? 'ring-2 ring-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.5)]' : ''}
        ${isCapturedInTurn ? 'ring-4 ring-rose-600 bg-rose-950/70 shadow-[0_0_18px_rgba(225,29,72,0.9)] z-25' : ''}
        ${isTargetedByOpponent ? 'ring-2 ring-rose-400' : ''}
      `}
      style={{
        // Orifício circular escavado com iluminação côncava e madeira polida
        background: 'radial-gradient(circle at 45% 35%, #4a2411 0%, #2e1509 60%, #170904 100%)',
        boxShadow: isSelected
          ? 'inset 0 8px 16px rgba(10,5,2,0.9), inset 0 -2px 5px rgba(255,225,180,0.35), 0 0 16px rgba(251,191,36,0.7)'
          : isCurrentDropTarget
          ? 'inset 0 8px 16px rgba(10,5,2,0.9), inset 0 -2px 5px rgba(255,225,180,0.5), 0 0 20px rgba(251,191,36,0.9)'
          : 'inset 0 6px 14px rgba(10,5,2,0.85), inset 0 -2px 4px rgba(255,225,180,0.3), 0 2px 5px rgba(60,25,8,0.35)',
        border: isCurrentDropTarget ? '3px solid #f59e0b' : '2px solid rgba(140, 70, 25, 0.85)',
      }}
    >
      {/* Bordo biselado e talhado do orifício na madeira */}
      <div className="absolute inset-0.5 rounded-full border border-amber-500/30 pointer-events-none" />

      {/* Indicador suave de semente a cair na cova (Sem abanar a tela) */}
      {isCurrentDropTarget && (
        <div className="absolute -top-3.5 z-40 px-2 py-0.5 rounded-full bg-amber-300 text-black font-black text-[10px] sm:text-xs shadow-lg flex items-center gap-1 border-2 border-black pointer-events-none">
          <span>+1</span>
          <span>🌰</span>
        </div>
      )}

      {/* Indicador da Última Semente (pouso final da jogada) */}
      {(isLastLandingPit || isHoveredLanding) && !isCurrentDropTarget && (
        <div className="absolute -top-3.5 z-30 px-2 py-0.5 rounded-full bg-emerald-300 text-black border-2 border-black font-black text-[9px] sm:text-xs shadow-lg flex items-center gap-1 whitespace-nowrap pointer-events-none">
          <span>🎯</span>
          <span>Fim</span>
        </div>
      )}

      {/* Indicador de Captura sob a mira na pré-visualização */}
      {isHoveredCapture && (
        <div className="absolute -top-3.5 z-30 px-2 py-0.5 rounded-full bg-rose-300 text-black border-2 border-black font-black text-[9px] sm:text-xs shadow-lg flex items-center gap-1 whitespace-nowrap pointer-events-none">
          <span>⚔</span>
          <span>Captura</span>
        </div>
      )}

      {/* Número de ordem no percurso da semeadura (1, 2, 3...) */}
      {sowStepOrder && sowStepOrder > 0 && !isCurrentDropTarget && !isLastLandingPit && !isHoveredLanding && (
        <div className="absolute -top-2 -right-1 z-25 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-amber-300 border-2 border-black text-black font-mono font-black text-[10px] sm:text-xs flex items-center justify-center shadow-md pointer-events-none">
          {sowStepOrder}
        </div>
      )}

      {/* Indicador de Tipo de Linha: Ataque vs Defesa em cor preta de alto contraste */}
      <div
        className={`absolute -top-1 px-1.5 py-0.2 text-[9px] sm:text-[10px] font-mono font-black tracking-tighter uppercase rounded border-2 border-black text-black pointer-events-none shadow-xs ${
          isAttack
            ? 'bg-rose-200'
            : 'bg-emerald-200'
        } ${showCoordinates ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
      >
        {isAttack ? 'Atq' : 'Def'}
      </div>

      {/* Sementes físicas no interior do orifício */}
      <div className="relative w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 md:w-13 md:h-13 lg:w-15 lg:h-15 flex items-center justify-center pointer-events-none">
        {renderPebbles()}
      </div>

      {/* Contador numérico de sementes: Letras e números em PRETO PURO com alto contraste */}
      <div
        className={`
          absolute z-15 px-2 py-0.5 rounded-full text-xs sm:text-sm md:text-base font-black tabular-nums shadow-md pointer-events-none text-black border-2 border-black
          ${
            isCurrentDropTarget
              ? 'bg-amber-300 ring-2 ring-amber-500 scale-110'
              : seeds === 0
              ? 'bg-white/95 text-black border-black/70 text-[10px] sm:text-xs'
              : isPlayerA
              ? 'bg-amber-200'
              : 'bg-sky-200'
          }
          ${isLegal && !isCurrentDropTarget ? 'ring-2 ring-amber-400' : ''}
        `}
      >
        {seeds}
      </div>

      {/* Coordenada da Casa (ex: A0, B15) em PRETO PURO com borda preta sólida */}
      {showCoordinates && (
        <span className="absolute -bottom-1.5 z-20 text-[10px] sm:text-xs font-mono font-black text-black bg-white px-1.5 py-0.5 rounded border-2 border-black pointer-events-none shadow-sm leading-none">
          {pit.id}
        </span>
      )}
    </button>
  );
};

export const Pit = React.memo(PitComponent);
