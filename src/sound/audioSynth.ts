/**
 * BOA-MZ: Sintetizador de Áudio Procedural (Web Audio API)
 * Efeitos sonoros táteis e acústicos de madeira, sementes e tambores africanos
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;

  constructor() {
    // Inicialização tardia para respeitar as políticas de áudio dos navegadores
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Som de recolha de sementes (impacto oco de madeira)
   */
  public playPickup() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(240, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.08);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  }

  private lastSowTime = 0;

  /**
   * Som de semente caindo no orifício (toque nítido de semente/canhu na madeira)
   */
  public playSow(pitchModifier: number = 1.0) {
    if (!this.enabled) return;
    const nowMs = performance.now();
    // Prevenir sobrecarga do sintetizador em animações rápidas
    if (nowMs - this.lastSowTime < 35) return;
    this.lastSowTime = nowMs;

    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime;

      const baseFreq = 420 * pitchModifier;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.7, now + 0.04);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch {
      // Ignorar falhas de áudio para nunca travar a fluidez gráfica
    }
  }

  /**
   * Som de cascata/continuação (ressonância harmónica de transição)
   */
  public playRelay() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    [360, 480, 600].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const time = now + idx * 0.03;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0.12, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.07);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(time);
      osc.stop(time + 0.07);
    });
  }

  /**
   * Som de captura de sementes (ressonância marcante e vibrante de vitória na jogada)
   */
  public playCapture() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Batida grave tipo tambor djembe
    const oscDrum = ctx.createOscillator();
    const gainDrum = ctx.createGain();
    oscDrum.type = 'triangle';
    oscDrum.frequency.setValueAtTime(180, now);
    oscDrum.frequency.exponentialRampToValueAtTime(55, now + 0.18);
    gainDrum.gain.setValueAtTime(0.4, now);
    gainDrum.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    oscDrum.connect(gainDrum);
    gainDrum.connect(ctx.destination);
    oscDrum.start(now);
    oscDrum.stop(now + 0.18);

    // Chime de captura
    const oscChime = ctx.createOscillator();
    const gainChime = ctx.createGain();
    oscChime.type = 'sine';
    oscChime.frequency.setValueAtTime(660, now + 0.04);
    oscChime.frequency.exponentialRampToValueAtTime(880, now + 0.12);
    gainChime.gain.setValueAtTime(0.2, now + 0.04);
    gainChime.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    oscChime.connect(gainChime);
    gainChime.connect(ctx.destination);
    oscChime.start(now + 0.04);
    oscChime.stop(now + 0.18);
  }

  /**
   * Fanfarra de vitória
   */
  public playVictory() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const chords = [392.0, 440.0, 523.25, 659.25, 783.99]; // G4, A4, C5, E5, G5
    const now = ctx.currentTime;

    chords.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const time = now + idx * 0.1;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0.22, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(time);
      osc.stop(time + 0.4);
    });
  }

  /**
   * Som de jogada inválida ou aviso
   */
  public playInvalid() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.linearRampToValueAtTime(110, now + 0.12);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.12);
  }
}

export const sound = new SoundEngine();
