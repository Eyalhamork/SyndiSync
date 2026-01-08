// src/lib/audio.ts
// Audio utility for voice feedback sounds using Web Audio API

class AudioManager {
    private audioContext: AudioContext | null = null;
    private enabled: boolean = true;

    private getContext(): AudioContext {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        return this.audioContext;
    }

    setEnabled(enabled: boolean) {
        this.enabled = enabled;
    }

    // Play a simple tone
    private playTone(frequency: number, duration: number, type: OscillatorType = 'sine') {
        if (!this.enabled) return;

        try {
            const ctx = this.getContext();
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            oscillator.type = type;
            oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

            // Fade out for smooth sound
            gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

            oscillator.start(ctx.currentTime);
            oscillator.stop(ctx.currentTime + duration);
        } catch (e) {
            console.warn('Audio playback failed:', e);
        }
    }

    // Success sound - ascending tones
    playSuccess() {
        if (!this.enabled) return;

        const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5 (major chord arpeggio)

        frequencies.forEach((freq, i) => {
            setTimeout(() => {
                this.playTone(freq, 0.15, 'sine');
            }, i * 100);
        });
    }

    // Navigation sound - quick confirmation beep
    playNavigate() {
        if (!this.enabled) return;
        this.playTone(880, 0.1, 'sine'); // A5
        setTimeout(() => this.playTone(1100, 0.08, 'sine'), 80);
    }

    // Listening start sound - gentle notification
    playListeningStart() {
        if (!this.enabled) return;
        this.playTone(660, 0.12, 'sine'); // E5
    }

    // Error sound - descending tone
    playError() {
        if (!this.enabled) return;
        this.playTone(440, 0.15, 'triangle');
        setTimeout(() => this.playTone(330, 0.2, 'triangle'), 150);
    }

    // Subtle confirmation ping
    playPing() {
        if (!this.enabled) return;
        this.playTone(1200, 0.05, 'sine');
    }
}

// Singleton instance
export const audioManager = new AudioManager();

export default audioManager;
