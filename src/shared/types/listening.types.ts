import type { CatalogBook } from './catalog.types';

export interface CustomerChapter {
  id: number;
  title: string;
  chapterOrder: number;
  duration: number | null;
  audioUrl: string | null;
  status: 'FAILED' | 'PROCESSING_AUDIO' | 'AUDIO_READY' | null;
}
export interface BookOverviewResponse {
  book: CatalogBook & { voice?: { name?: string; voiceName?: string } | null };
  chapterCount: number;
  totalDuration: number;
  firstChapter: CustomerChapter | null;
}
export interface ChapterProgress {
  chapterId: number;
  chapterIndex: number;
  lastPlayAt: number;
  isComplete: boolean;
  updatedAt: string;
}
export interface BookProgress {
  bookId: number;
  hasProgress: boolean;
  chapters: ChapterProgress[];
  chapterCount: number;
  completedChapterCount: number;
  isBookComplete: boolean;
  resume: { chapterId: number; chapterIndex: number; lastPlayAt: number } | null;
}
export interface SaveListeningProgress { lastPlayAt: number; isComplete: boolean }
export interface PlaybackDetails {
  overview: BookOverviewResponse;
  chapters: CustomerChapter[];
  purchased: boolean;
}
