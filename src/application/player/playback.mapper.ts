import type { PlaybackDetails } from "@/shared/types/listening.types";
import type { PlayerBook, PlayerChapter } from "@/shared/types/player.types";

export function mapPlaybackDetails({
  overview,
  chapters,
  purchased,
}: PlaybackDetails) {
  const raw = overview.book;
  const book: PlayerBook = {
    id: String(raw.id),
    title: raw.title,
    coverTitle: raw.title,
    author:
      (raw.authors ?? [])
        .map(({ author }) => author.fullName)
        .filter(Boolean)
        .join(", ") || "Nhiều tác giả",
    categoryLabel:
      (raw.categories ?? []).map(({ category }) => category.name).join(" · ") ||
      "Sách nói",
    price: raw.price ?? null,
    cover: {
      uri: raw.coverImage?.url || undefined,
      background: "#FFF1F2",
      ink: "#713B4C",
    },
  };
  const mapped: PlayerChapter[] = chapters.map((chapter, index) => ({
    id: String(chapter.id),
    title: chapter.title,
    duration: Math.max(0, chapter.duration ?? 0),
    isFree: index < 3,
    canPlay: index < 3 || purchased,
    audioUrl: chapter.audioUrl,
    status: chapter.status,
  }));
  return { book, chapters: mapped };
}
