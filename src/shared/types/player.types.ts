export const PLAYBACK_RATES = [0.75, 1, 1.25, 1.5, 1.75, 2] as const;
export type PlaybackRate = typeof PLAYBACK_RATES[number];

export interface PlayerBook {
  id: string;
  title: string;
  coverTitle: string;
  author: string;
  categoryLabel: string;
  price: number | null;
  cover: { source?: number; uri?: string; background: string; ink: string };
}

export interface PlayerChapter {
  id: string;
  title: string;
  duration: number;
  isFree: boolean;
  canPlay?: boolean;
  audioUrl?: string | null;
  status?: 'FAILED' | 'PROCESSING_AUDIO' | 'AUDIO_READY' | null;
}

export interface PlayerSnapshot {
  book: PlayerBook | null;
  chapters: PlayerChapter[];
  chapterIndex: number;
  position: number;
  isPlaying: boolean;
  rate: PlaybackRate;
  sleepEndsAt: number | null;
  bookmarked: boolean;
  notice: string | null;
  isLoading: boolean;
  isBuffering: boolean;
  error: string | null;
  progressError: string | null;
  isSaving: boolean;
  savesProgress: boolean;
}
