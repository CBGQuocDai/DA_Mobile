import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';
import type { AudioEngine } from '@/application/player/player.ports';

/** Created lazily so static web rendering never constructs a native/HTML audio player. */
export function createExpoAudioEngine(): AudioEngine {
  let player: AudioPlayer | null = null;
  let subscription: { remove(): void } | null = null;
  let cancelLoad: (() => void) | null = null;
  const unload = () => {
    cancelLoad?.();
    cancelLoad = null;
    subscription?.remove();
    subscription = null;
    if (player) {
      player.pause();
      player.clearLockScreenControls();
      player.remove();
      player = null;
    }
  };
  return {
    async load(url, book, onStatus) {
      unload();
      // No recording permissions are needed for playback.
      void setAudioModeAsync({ playsInSilentMode: true, shouldPlayInBackground: true, interruptionMode: 'doNotMix' }).catch(() => {});
      const current = createAudioPlayer({ uri: url }, { updateInterval: 500 });
      player = current;
      current.setActiveForLockScreen(true, { title: book.title, artist: book.author, artworkUrl: book.cover.uri });
      await new Promise<void>((resolve, reject) => {
        let loaded = false;
        const timer = setTimeout(() => finish(new Error('Audio tải quá lâu. Vui lòng thử lại.')), 20000);
        const finish = (error?: Error) => {
          if (loaded) return;
          loaded = true;
          clearTimeout(timer);
          cancelLoad = null;
          if (error) reject(error); else resolve();
        };
        cancelLoad = () => finish(new Error('Đã đổi chương.'));
        subscription = current.addListener('playbackStatusUpdate', (status) => {
          if (player !== current) return;
          if (status.error) finish(new Error('Không thể tải âm thanh. Vui lòng thử lại.'));
          else if (status.isLoaded) finish();
          onStatus({ position: status.currentTime, playing: status.playing, buffering: status.isBuffering,
            ended: status.didJustFinish, error: Boolean(status.error) });
        });
        if (current.currentStatus.isLoaded) finish();
        else if (current.currentStatus.error) finish(new Error('Không thể tải âm thanh.'));
      });
    },
    play: () => player?.play(),
    pause: () => player?.pause(),
    seek: async (seconds) => { await player?.seekTo(seconds, 0, 0); },
    setRate: (rate) => { if (player) player.setPlaybackRate(rate); },
    unload,
  };
}
