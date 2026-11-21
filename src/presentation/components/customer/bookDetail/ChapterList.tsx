import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { AppIcon } from "@/presentation/components/common/AppIcon";
import type { useBookDetailInteractions } from "@/presentation/hooks/customer/useBookDetailInteractions";
import {
  formatAudioClock,
} from "@/presentation/utils/bookDetail.utils";
import { CustomerTheme as C } from "@/shared/constants/customerTheme.constants";
import { DetailSection } from "./DetailSection";
import type { BookChapterPreview } from "./bookDetail.types";

export function ChapterList({
  chapters,
  playback,
}: {
  chapters: BookChapterPreview[];
  playback: ReturnType<typeof useBookDetailInteractions>;
}) {
  const [onlyFree, setOnlyFree] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const matches = chapters
    .map((chapter, index) => ({ ...chapter, index }))
    .filter(
      (chapter) =>
        !onlyFree || chapter.isFree,
    );
  const visible = expanded ? matches : matches.slice(0, 5);

  return (
    <DetailSection title="Danh sách chương" count={chapters.length}>
      <View style={styles.filters}>
        {[false, true].map((free) => (
          <Pressable
            key={String(free)}
            accessibilityRole="button"
            accessibilityState={{ selected: onlyFree === free }}
            onPress={() => {
              setOnlyFree(free);
              setExpanded(false);
            }}
            style={[styles.filter, onlyFree === free && styles.selectedFilter]}
          >
            <Text
              style={[
                styles.filterText,
                onlyFree === free && styles.selectedText,
              ]}
            >
              {free ? "Nghe thử miễn phí" : "Tất cả chương"}
            </Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.list}>
        {visible.map((chapter) => {
          const active = chapter.id === playback.activeChapter?.id;
          return (
            <Pressable
              key={chapter.id}
              accessibilityRole="button"
              accessibilityLabel={`Chương ${chapter.index + 1}: ${chapter.title}, ${chapter.canPlay ?? chapter.isFree ? "có thể nghe" : "mua sách để mở khóa"}`}
              accessibilityState={{ selected: active }}
              onPress={() => playback.selectChapter(chapter)}
              style={({ pressed }) => [
                styles.chapter,
                active && styles.activeChapter,
                pressed && styles.pressed,
              ]}
            >
              <View style={[styles.number, active && styles.activeNumber]}>
                <Text
                  style={[styles.numberText, active && styles.selectedText]}
                >
                  {String(chapter.index + 1).padStart(2, "0")}
                </Text>
              </View>
              <View style={styles.chapterBody}>
                <Text
                  numberOfLines={2}
                  style={[styles.chapterTitle, active && styles.selectedText]}
                >
                  {chapter.title}
                </Text>
                <View style={styles.chapterMetadata}>
                  <Text style={styles.duration}>
                    {formatAudioClock(chapter.duration)}
                  </Text>
                  {chapter.isFree && <Text style={styles.free}>Miễn phí</Text>}
                  {chapter.status !== undefined && chapter.status !== 'AUDIO_READY' && <Text style={styles.duration}>Audio chưa sẵn sàng</Text>}
                  {active && (
                    <Text style={styles.activeLabel}>
                      {playback.isPlaying ? "Đang nghe" : "Đã tạm dừng"}
                    </Text>
                  )}
                </View>
              </View>
              <View
                style={[styles.chapterAction, active && styles.activeAction]}
              >
                <AppIcon
                  name={
                    !(chapter.canPlay ?? chapter.isFree)
                      ? "lock"
                      : active && playback.isPlaying
                        ? "pause"
                        : "play"
                  }
                  size={17}
                  color={
                    active ? "#FFFFFF" : (chapter.canPlay ?? chapter.isFree) ? C.accent : C.muted
                  }
                />
              </View>
            </Pressable>
          );
        })}
        {!matches.length && (
          <Text style={styles.empty}>
            {chapters.length ? 'Chưa có chương nghe thử miễn phí.' : 'Sách chưa có chương nào.'}
          </Text>
        )}
      </View>
      {matches.length > 5 && (
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ expanded }}
          onPress={() => setExpanded((value) => !value)}
          style={styles.expand}
        >
          <Text style={styles.expandText}>
            {expanded
              ? "Thu gọn danh sách"
              : `Xem tất cả ${matches.length} chương`}
          </Text>
          <AppIcon
            name={expanded ? "chevronUp" : "chevronDown"}
            size={16}
            color={C.accent}
          />
        </Pressable>
      )}
    </DetailSection>
  );
}
const styles = StyleSheet.create({
  filters: { flexDirection: "row", gap: 8, marginTop: 12, marginBottom: 17 },
  filter: {
    borderRadius: 20,
    backgroundColor: C.surface,
    paddingHorizontal: 13,
    paddingVertical: 10,
  },
  selectedFilter: { backgroundColor: C.accentLight },
  filterText: { color: C.secondary, fontSize: 10, fontWeight: "600" },
  selectedText: { color: C.accent },
  list: { gap: 9 },
  chapter: {
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 13,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    backgroundColor: C.background,
  },
  activeChapter: { borderColor: "#F2AFBE", backgroundColor: "#FFF8FA" },
  number: {
    width: 30,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    backgroundColor: C.surface,
  },
  activeNumber: { backgroundColor: "#FCE3E9" },
  numberText: { color: C.muted, fontSize: 11, fontWeight: "700" },
  chapterBody: { flex: 1 },
  chapterTitle: {
    color: C.text,
    fontSize: 11,
    fontWeight: "600",
    lineHeight: 18,
  },
  chapterMetadata: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 7,
    marginTop: 5,
  },
  duration: { color: C.secondary, fontSize: 9 },
  free: {
    color: "#338267",
    backgroundColor: "#EBF7F1",
    borderRadius: 4,
    overflow: "hidden",
    fontSize: 8,
    fontWeight: "600",
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  activeLabel: { color: C.accent, fontSize: 8 },
  chapterAction: {
    width: 31,
    height: 31,
    borderRadius: 16,
    backgroundColor: C.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  activeAction: { backgroundColor: C.accent },
  expand: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: "#F3D7DE",
    paddingVertical: 13,
    borderRadius: 12,
    marginTop: 15,
  },
  expandText: { color: C.accent, fontSize: 11, fontWeight: "600" },
  empty: {
    color: C.secondary,
    fontSize: 12,
    lineHeight: 21,
    textAlign: "center",
    paddingVertical: 24,
  },
  pressed: { opacity: 0.7 },
});
