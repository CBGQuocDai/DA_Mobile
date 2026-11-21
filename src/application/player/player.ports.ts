import type { BookProgress, PlaybackDetails, SaveListeningProgress } from '@/shared/types/listening.types';
import type { PlayerBook } from '@/shared/types/player.types';

export interface AudioStatus {
  position: number;
  playing: boolean;
  buffering: boolean;
  ended: boolean;
  error: boolean;
}
export interface AudioEngine {
  load(url: string, book: PlayerBook, onStatus: (status: AudioStatus) => void): Promise<void>;
  play(): void;
  pause(): void;
  seek(seconds: number): Promise<void>;
  setRate(rate: number): void;
  unload(): void;
}
export interface ProgressTransport {
  load(): Promise<BookProgress>;
  save(chapterId: number, body: SaveListeningProgress): Promise<BookProgress>;
}
export interface PlaybackRepository {
  getDetails(bookId: string, token: string | null, signal?: AbortSignal): Promise<PlaybackDetails>;
  progress(bookId: string, token: string): ProgressTransport;
}
export interface PlayerSession {
  initialize(): Promise<void>;
  getIdentity(): string | null;
  getToken(): string | null;
  subscribe(listener: () => void): () => void;
}
