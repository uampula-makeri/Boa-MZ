import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  GameState,
  GameConfig,
  GameMode,
  AIDifficulty,
  Player,
  MoveStep,
} from './engine/types';
import { createInitialState, executeMove, undoMove } from './engine/gameEngine';
import { getLegalMoves } from './engine/moveGenerator';
import { getPlayerPits } from './engine/boardMapping';
import { selectAIMove } from './ai/opponent';
import { sound } from './sound/audioSynth';
import { TitleScreen } from './components/TitleScreen';
import { Board } from './components/Board';
import { PlayerPanel } from './components/PlayerPanel';
import { GameControls } from './components/GameControls';
import { MoveHistory } from './components/MoveHistory';
import { TutorialModal } from './components/TutorialModal';
import { CulturalValidationModal } from './components/CulturalValidationModal';
import { TestRunnerModal } from './components/TestRunnerModal';
import { SettingsModal } from './components/SettingsModal';
import { GameOverModal } from './components/GameOverModal';
import { AuthenticBoardModal } from './components/AuthenticBoardModal';
import { ArrowLeft, Sparkles, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { useLanguage } from './i18n/LanguageContext';
import { LanguageSelector } from './components/LanguageSelector';

interface SowingProgress {
  isAnimating: boolean;
  activePitId: string | null;
  seedsInHand: number | null;
  stepNote: string | null;
  lastLandingPitId: string | null;
  sowedSequence: string[];
  liveBoard: Record<string, number> | null;
  capturedPitIds: string[];
}

const initialSowingProgress: SowingProgress = {
  isAnimating: false,
  activePitId: null,
  seedsInHand: null,
  stepNote: null,
  lastLandingPitId: null,
  sowedSequence: [],
  liveBoard: null,
  capturedPitIds: [],
};

export default function App() {
  const { t } = useLanguage();
  const [screen, setScreen] = useState<'title' | 'playing'>('title');
  const [gameState, setGameState] = useState<GameState>(() => createInitialState());
  const [selectedPitId, setSelectedPitId] = useState<string | null>(null);
  
  // Estado atómico consolidado de semeadura passo a passo (alta performance e zero lag)
  const [sowing, setSowing] = useState<SowingProgress>(initialSowingProgress);
  const [isThinkingAI, setIsThinkingAI] = useState(false);
  const sowingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const aiTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Modais
  const [showTutorial, setShowTutorial] = useState(false);
  const [showDossier, setShowDossier] = useState(false);
  const [showTests, setShowTests] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAuthenticModal, setShowAuthenticModal] = useState(false);
  const [invalidMoveMessage, setInvalidMoveMessage] = useState<string | null>(null);

  // Referência ao estado mais recente para o loop de IA
  const gameStateRef = useRef(gameState);
  gameStateRef.current = gameState;

  // Limpar timers pendentes caso o componente seja reiniciado
  useEffect(() => {
    return () => {
      if (sowingTimerRef.current) clearInterval(sowingTimerRef.current);
      if (aiTimerRef.current) clearTimeout(aiTimerRef.current);
    };
  }, []);

  // Atualizar som com base na configuração
  useEffect(() => {
    sound.setEnabled(gameState.config.soundEnabled);
  }, [gameState.config.soundEnabled]);

  // Memoizar jogadas legais para não recalcular a cada quadro de animação
  const legalMoves = useMemo(
    () =>
      getLegalMoves(
        gameState.board,
        gameState.currentPlayer,
        gameState.phase,
        gameState.config.profile
      ),
    [gameState.board, gameState.currentPlayer, gameState.phase, gameState.config.profile]
  );

  // Iniciar partida a partir do ecrã inicial
  const handleStartGame = (mode: GameMode, difficulty: AIDifficulty = 'medium') => {
    if (sowingTimerRef.current) {
      clearInterval(sowingTimerRef.current);
      sowingTimerRef.current = null;
    }
    if (aiTimerRef.current) {
      clearTimeout(aiTimerRef.current);
      aiTimerRef.current = null;
    }
    setIsThinkingAI(false);
    const newState = createInitialState({
      mode,
      aiDifficulty: difficulty,
    });
    setGameState(newState);
    setSelectedPitId(null);
    setSowing(initialSowingProgress);
    setScreen('playing');
    sound.playPickup();
  };

  // Executar uma jogada completa com cadência fluida e atualização atómica
  const handlePlayMove = useCallback(
    (originPitId: string, isAI: boolean = false) => {
      const currentState = gameStateRef.current;

      // Se for jogada do jogador humano:
      if (!isAI) {
        // Bloquear clique se estiver a semear, se a IA estiver a pensar ou se jogo terminou
        if (sowing.isAnimating || isThinkingAI || currentState.status !== 'in_progress') return;
        // No modo contra computador, jogador humano (A) só pode jogar na sua vez
        if (currentState.config.mode === 'ai' && currentState.currentPlayer === currentState.config.aiPlayer) {
          return;
        }
      } else {
        // Se for jogada acionada pela IA, verificar apenas se o jogo está em progresso
        if (currentState.status !== 'in_progress') return;
      }

      const { state: nextState, result } = executeMove(currentState, originPitId);
      if (!result.valid) {
        if (!isAI) {
          sound.playInvalid();
          setInvalidMoveMessage(result.reason || 'Jogada inválida.');
          setTimeout(() => setInvalidMoveMessage(null), 3000);
        }
        return;
      }

      setInvalidMoveMessage(null);
      setSelectedPitId(originPitId);

      // Limpar timer de semeadura anterior se houver
      if (sowingTimerRef.current) {
        clearInterval(sowingTimerRef.current);
        sowingTimerRef.current = null;
      }

      // Identificar a cova final onde a última semente termina
      const lastSowStep = [...result.steps].reverse().find(s => s.type === 'sow');
      const finalLandingPit = lastSowStep ? lastSowStep.pitId : null;

      // Se velocidade instantânea, aplica direto
      if (currentState.config.animationSpeed === 'instant') {
        sound.playPickup();
        if (result.capturedCount > 0) {
          sound.playCapture();
        }
        setGameState(nextState);
        setSelectedPitId(null);
        setSowing({
          ...initialSowingProgress,
          lastLandingPitId: finalLandingPit,
          sowedSequence: result.sowedPits,
          capturedPitIds: result.capturedPitIds,
        });
        return;
      }

      // Cadência rápida e ágil para eliminar lentidão percebida
      const speedMs =
        currentState.config.animationSpeed === 'slow'
          ? 130
          : currentState.config.animationSpeed === 'fast'
          ? 40
          : 75;

      const runningBoard: Record<string, number> = { ...currentState.board };
      let stepIdx = 0;
      let currentSeq: string[] = [];
      let currentCaptured: string[] = [];

      // Estado inicial da animação
      setSowing({
        isAnimating: true,
        activePitId: originPitId,
        seedsInHand: typeof result.steps[0]?.seedsInHand === 'number' ? result.steps[0].seedsInHand : null,
        stepNote: result.steps[0]?.note || null,
        lastLandingPitId: finalLandingPit,
        sowedSequence: [],
        liveBoard: { ...runningBoard },
        capturedPitIds: [],
      });

      sowingTimerRef.current = setInterval(() => {
        if (stepIdx >= result.steps.length) {
          if (sowingTimerRef.current) {
            clearInterval(sowingTimerRef.current);
            sowingTimerRef.current = null;
          }
          setGameState(nextState);
          setSelectedPitId(null);
          setSowing({
            ...initialSowingProgress,
            lastLandingPitId: finalLandingPit,
            sowedSequence: result.sowedPits,
            capturedPitIds: result.capturedPitIds,
          });
          return;
        }

        const step = result.steps[stepIdx];

        if (step.type === 'pickup') {
          sound.playPickup();
          runningBoard[step.pitId] = 0;
        } else if (step.type === 'sow') {
          sound.playSow();
          runningBoard[step.pitId] = step.seedsNow;
          if (!currentSeq.includes(step.pitId)) {
            currentSeq = [...currentSeq, step.pitId];
          }
        } else if (step.type === 'relay_pickup') {
          sound.playRelay();
          runningBoard[step.pitId] = 0;
        } else if (step.type === 'capture') {
          sound.playCapture();
          runningBoard[step.pitId] = 0;
          if (!currentCaptured.includes(step.pitId)) {
            currentCaptured = [...currentCaptured, step.pitId];
          }
        }

        // Uma única atualização de estado atómica por passo (evita re-renderizações em cascata)
        setSowing({
          isAnimating: true,
          activePitId: step.pitId,
          seedsInHand: typeof step.seedsInHand === 'number' ? step.seedsInHand : null,
          stepNote: step.note || null,
          lastLandingPitId: finalLandingPit,
          sowedSequence: currentSeq,
          liveBoard: { ...runningBoard },
          capturedPitIds: currentCaptured,
        });

        stepIdx++;
      }, speedMs);
    },
    [sowing.isAnimating, isThinkingAI]
  );

  // Manter referência estável da função para o setTimeout da IA sem causar re-render ou cancelamento
  const handlePlayMoveRef = useRef(handlePlayMove);
  handlePlayMoveRef.current = handlePlayMove;

  // Processar jogada automática da Inteligência Artificial quando for a vez do Computador (Jogador B)
  useEffect(() => {
    if (aiTimerRef.current) {
      clearTimeout(aiTimerRef.current);
      aiTimerRef.current = null;
    }

    if (screen !== 'playing') return;
    if (gameState.status !== 'in_progress') return;
    if (gameState.config.mode !== 'ai') return;
    if (gameState.currentPlayer !== gameState.config.aiPlayer) return;
    if (sowing.isAnimating) return;

    setIsThinkingAI(true);
    const thinkDelay = gameState.config.animationSpeed === 'instant' ? 80 : 420;

    aiTimerRef.current = setTimeout(() => {
      const currentState = gameStateRef.current;
      if (
        currentState.status !== 'in_progress' ||
        currentState.currentPlayer !== currentState.config.aiPlayer
      ) {
        setIsThinkingAI(false);
        return;
      }

      const decision = selectAIMove(currentState);
      setIsThinkingAI(false);

      if (decision) {
        handlePlayMoveRef.current(decision.pitId, true);
      }
    }, thinkDelay);

    return () => {
      if (aiTimerRef.current) {
        clearTimeout(aiTimerRef.current);
        aiTimerRef.current = null;
      }
    };
  }, [
    gameState.currentPlayer,
    gameState.turnCount,
    gameState.status,
    gameState.config.mode,
    gameState.config.aiPlayer,
    gameState.config.animationSpeed,
    sowing.isAnimating,
    screen,
  ]);

  // Ações de controlo
  const handleUndo = () => {
    if (sowing.isAnimating || isThinkingAI) return;
    if (sowingTimerRef.current) {
      clearInterval(sowingTimerRef.current);
      sowingTimerRef.current = null;
    }
    if (aiTimerRef.current) {
      clearTimeout(aiTimerRef.current);
      aiTimerRef.current = null;
    }
    setIsThinkingAI(false);
    // Se estiver em modo IA, desfaz duas vezes para voltar ao turno do jogador humano
    if (gameState.config.mode === 'ai' && gameState.history.length >= 2) {
      const state1 = undoMove(gameState);
      const state2 = undoMove(state1);
      setGameState(state2);
    } else {
      setGameState(undoMove(gameState));
    }
    sound.playPickup();
    setSelectedPitId(null);
    setSowing(initialSowingProgress);
  };

  const handleRestart = () => {
    if (sowingTimerRef.current) {
      clearInterval(sowingTimerRef.current);
      sowingTimerRef.current = null;
    }
    if (aiTimerRef.current) {
      clearTimeout(aiTimerRef.current);
      aiTimerRef.current = null;
    }
    setIsThinkingAI(false);
    setGameState(createInitialState({ ...gameState.config }));
    setSelectedPitId(null);
    setSowing(initialSowingProgress);
    sound.playPickup();
  };

  const handleUpdateConfig = (newConfig: Partial<GameConfig>) => {
    setGameState(prev => ({
      ...prev,
      config: { ...prev.config, ...newConfig },
    }));
  };

  // Atalhos de teclado globais
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignorar se estiver em campos de texto
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      if (screen === 'title') {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleStartGame('ai', 'medium');
        }
        return;
      }

      if (screen === 'playing') {
        if (e.key === 'Escape') {
          setScreen('title');
        } else if (e.key === 'u' || e.key === 'U') {
          handleUndo();
        } else if (e.key === 'r' || e.key === 'R') {
          handleRestart();
        } else if (e.key === 'm' || e.key === 'M') {
          handleUpdateConfig({ soundEnabled: !gameState.config.soundEnabled });
        } else if (e.key === '?' || e.key === 'h' || e.key === 'H') {
          setShowTutorial(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [screen, gameState.config.soundEnabled, handleUndo, handleRestart]);

  // Contagem de sementes nos lados dos jogadores (acompanhando o tabuleiro ao vivo)
  const activeBoard = sowing.liveBoard || gameState.board;
  const pitsA = getPlayerPits('A');
  const pitsB = getPlayerPits('B');
  const seedsOnBoardA = pitsA.reduce((sum, p) => sum + (activeBoard[p.id] || 0), 0);
  const seedsOnBoardB = pitsB.reduce((sum, p) => sum + (activeBoard[p.id] || 0), 0);

  return (
    <div className="relative min-h-screen flex flex-col font-sans select-none antialiased bg-gradient-to-b from-[#f2e2ce] via-[#e5cbb0] to-[#cca985] text-stone-900 transition-colors duration-700 overflow-x-hidden">
      {/* Imagem de Fundo Autêntica do Solo de Areia Natural Moçambicana para Todo o Jogo */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <img
          src="/src/assets/images/mozambique_natural_sand_ground_1792692127524.jpg"
          alt="Solo e areia natural moçambicana da savana"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover scale-105 filter brightness-105 contrast-110 opacity-30 mix-blend-multiply"
        />
        {/* Iluminação Quente da Savana */}
        <div className="absolute -top-32 -right-32 w-[650px] h-[650px] bg-gradient-to-bl from-amber-300/35 via-orange-200/20 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-[600px] h-[600px] bg-gradient-to-tr from-amber-600/15 via-orange-400/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      </div>

      {screen === 'title' ? (
        <TitleScreen
          onStartGame={handleStartGame}
          onOpenTutorial={() => setShowTutorial(true)}
          onOpenDossier={() => setShowDossier(true)}
          onOpenTests={() => setShowTests(true)}
          onOpenAuthenticShowcase={() => setShowAuthenticModal(true)}
        />
      ) : (
        <div className="relative z-10 flex-1 flex flex-col justify-between p-2 sm:p-4 md:p-6 max-w-6xl mx-auto w-full">
          {/* Barra Superior da Partida */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 mb-2 border-b-2 border-amber-900/25">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setScreen('title')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#fffdfa] hover:bg-white text-stone-950 text-xs sm:text-sm font-black border-2 border-amber-900/30 shadow-xs cursor-pointer transition-all"
              >
                <ArrowLeft className="w-4 h-4 text-amber-800" />
                <span className="hidden sm:inline">{t.mainMenuBtn}</span>
              </button>
              <div>
                <h1 className="text-base sm:text-lg font-black tracking-wider text-amber-950">
                  {t.gameTitle}
                </h1>
                <span className="text-xs text-amber-950/90 font-mono font-bold">
                  {gameState.config.profile.name}
                </span>
              </div>
            </div>

            {/* Fase do Jogo, Idioma & Turno */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Seletor de Idioma */}
              <LanguageSelector />

              <button
                type="button"
                onClick={() => setShowAuthenticModal(true)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#fffdfa] hover:bg-white border-2 border-amber-900/30 text-amber-950 text-xs font-black cursor-pointer transition-all shadow-xs"
              >
                <ImageIcon className="w-3.5 h-3.5 text-amber-800" />
                <span>{t.photoRealBtn}</span>
              </button>
              <div className="px-3 py-1 rounded-xl bg-[#fffdfa] border-2 border-amber-900/30 text-xs font-mono text-stone-950 shadow-xs">
                <span className="text-stone-800 font-bold">{t.turnLabel}:</span>{' '}
                <b className="text-amber-950 font-black">{gameState.turnCount}</b>
              </div>
              <div
                className={`px-3 py-1 rounded-xl border-2 text-xs font-black shadow-xs ${
                  gameState.phase === 'phase1_groups'
                    ? 'bg-amber-100 text-amber-950 border-amber-600'
                    : 'bg-purple-100 text-purple-950 border-purple-600'
                }`}
              >
                {gameState.phase === 'phase1_groups' ? t.phase1Title : t.phase2Title}
              </div>
            </div>
          </div>

          {/* Mensagem de Jogada Inválida se houver */}
          {invalidMoveMessage && (
            <div className="mx-auto mb-2 px-4 py-2 rounded-xl bg-rose-100/95 border border-rose-500 text-rose-950 text-xs font-semibold flex items-center gap-2 shadow-md animate-bounce">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>{invalidMoveMessage}</span>
            </div>
          )}

          {/* Painéis dos Jogadores Norte (B) */}
          <div className="flex justify-center mb-2">
            <PlayerPanel
              player="B"
              isCurrent={gameState.currentPlayer === 'B'}
              capturedCount={gameState.capturedB}
              seedsOnBoard={seedsOnBoardB}
              phase={gameState.phase}
              mode={gameState.config.mode}
              aiDifficulty={gameState.config.aiDifficulty}
              isThinkingAI={isThinkingAI}
            />
          </div>

          {/* Tabuleiro Central Dominante com Sensação Física */}
          {/* Tabuleiro Central Dominante com Sensação Física e Zero Tremor */}
          <div className="my-auto py-2">
            <Board
              board={activeBoard}
              currentPlayer={gameState.currentPlayer}
              phase={gameState.phase}
              capturedA={gameState.capturedA}
              capturedB={gameState.capturedB}
              legalMoves={gameState.config.showHints ? legalMoves : []}
              selectedPitId={selectedPitId}
              sowedPitIdsInTurn={sowing.sowedSequence}
              capturedPitIdsInTurn={sowing.capturedPitIds}
              isThinkingAI={isThinkingAI || sowing.isAnimating}
              showCoordinates={gameState.config.showCoordinates}
              profile={gameState.config.profile}
              currentActivePitId={sowing.activePitId}
              seedsInHand={sowing.seedsInHand}
              activeStepNote={sowing.stepNote}
              lastLandingPitId={sowing.lastLandingPitId}
              onSelectPit={handlePlayMove}
              onOpenAuthenticShowcase={() => setShowAuthenticModal(true)}
            />
          </div>

          {/* Painel do Jogador Sul (A) */}
          <div className="flex justify-center mt-2 mb-3">
            <PlayerPanel
              player="A"
              isCurrent={gameState.currentPlayer === 'A'}
              capturedCount={gameState.capturedA}
              seedsOnBoard={seedsOnBoardA}
              phase={gameState.phase}
              mode={gameState.config.mode}
              aiDifficulty={gameState.config.aiDifficulty}
              isThinkingAI={false}
            />
          </div>

          {/* Controlos de Jogo */}
          <div className="mb-3">
            <GameControls
              canUndo={gameState.history.length > 0 && !sowing.isAnimating && !isThinkingAI}
              soundEnabled={gameState.config.soundEnabled}
              showHints={gameState.config.showHints}
              invariantStatus={gameState.invariantAudit}
              onUndo={handleUndo}
              onRestart={handleRestart}
              onToggleSound={() => handleUpdateConfig({ soundEnabled: !gameState.config.soundEnabled })}
              onToggleHints={() => handleUpdateConfig({ showHints: !gameState.config.showHints })}
              onOpenRules={() => setShowTutorial(true)}
              onOpenDossier={() => setShowDossier(true)}
              onOpenSettings={() => setShowSettings(true)}
              onOpenTests={() => setShowTests(true)}
              onOpenTutorial={() => setShowTutorial(true)}
            />
          </div>

          {/* Histórico Colapsável */}
          <div className="mt-1">
            <MoveHistory history={gameState.history} turnCount={gameState.turnCount} />
          </div>
        </div>
      )}

      {/* Modais Globais */}
      <AuthenticBoardModal isOpen={showAuthenticModal} onClose={() => setShowAuthenticModal(false)} />
      <TutorialModal isOpen={showTutorial} onClose={() => setShowTutorial(false)} />
      <CulturalValidationModal isOpen={showDossier} onClose={() => setShowDossier(false)} />
      <TestRunnerModal isOpen={showTests} onClose={() => setShowTests(false)} />
      <SettingsModal
        isOpen={showSettings}
        config={gameState.config}
        onUpdateConfig={handleUpdateConfig}
        onClose={() => setShowSettings(false)}
        onRestartWithNewRules={handleRestart}
      />
      <GameOverModal
        status={gameState.status}
        winner={gameState.winner}
        capturedA={gameState.capturedA}
        capturedB={gameState.capturedB}
        turnCount={gameState.turnCount}
        mode={gameState.config.mode}
        onRestart={handleRestart}
        onClose={() => setGameState(prev => ({ ...prev, status: 'in_progress' }))}
      />
    </div>
  );
}
