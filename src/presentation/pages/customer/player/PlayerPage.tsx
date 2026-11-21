import { useIsFocused, useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppIcon } from "@/presentation/components/common/AppIcon";
import { PlayerArtwork } from "@/presentation/components/customer/player/PlayerArtwork";
import { PlayerControls } from "@/presentation/components/customer/player/PlayerControls";
import {
  PlayerOptionsSheet,
  type PlayerSheet,
} from "@/presentation/components/customer/player/PlayerOptionsSheet";
import { PlayerSeekBar } from "@/presentation/components/customer/player/PlayerSeekBar";
import { usePlayer } from "@/presentation/hooks/customer/usePlayer";
import {
  bookDetailRoute,
  formatAudioClock,
} from "@/presentation/utils/bookDetail.utils";
import { playerRoute } from "@/presentation/utils/player.utils";
import { CustomerTheme as C } from "@/shared/constants/customerTheme.constants";

const first = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

export function PlayerPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const isFocused = useIsFocused();
  const dimensions = useWindowDimensions();
  const player = usePlayer();
  const chapterId = first(params.chapterId) || "";
  const bookId = first(params.bookId);
  const bootstrapped = useRef(false);
  const [routeError, setRouteError] = useState(false);
  const [sheet, setSheet] = useState<PlayerSheet>(null);
  const [shareNotice, setShareNotice] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  // A direct reload restores BE progress, paused until a user gesture permits playback.
  useEffect(() => {
    if (!isFocused || bootstrapped.current) return;
    bootstrapped.current = true;
    if (!bookId) {
      setRouteError(true);
      return;
    }
    if (
      !player.isLoading &&
      (player.book?.id !== bookId ||
        !player.chapter ||
        (chapterId !== "resume" && player.chapter.id !== chapterId))
    )
      void player.open(bookId, chapterId || "resume", false);
  }, [
    isFocused,
    player.book,
    player.chapter,
    player.isLoading,
    player.open,
    bookId,
    chapterId,
  ]);

  useEffect(() => {
    if (
      !isFocused ||
      player.isLoading ||
      player.error ||
      !player.book ||
      !player.chapter
    )
      return;
    if (player.chapter.id !== chapterId || player.book.id !== bookId)
      router.setParams(playerRoute(player.book, player.chapter.id).params);
  }, [
    isFocused,
    player.book,
    player.chapter,
    player.isLoading,
    player.error,
    chapterId,
    bookId,
    router,
  ]);

  const backToBook = () => {
    if (player.book) router.replace(bookDetailRoute(player.book));
    else if (bookId)
      router.replace({ pathname: "/book/[id]", params: { id: bookId } });
    else router.replace("/(tabs)");
  };

  const minimize = () => {
    if (router.canGoBack()) router.back();
    else backToBook();
  };

  if (!player.book || !player.chapter) {
    return (
      <SafeAreaView style={[styles.screen, styles.empty]}>
        <StatusBar style="dark" />
        {routeError ||
        player.error ||
        (bootstrapped.current && !player.isLoading) ? (
          <>
            <AppIcon name="headphones" color={C.muted} size={42} />
            <Text style={styles.emptyText}>
              {player.error ||
                (routeError
                  ? "Thiếu thông tin sách để mở trình phát."
                  : "Phiên nghe đã kết thúc. Mở sách để nghe tiếp.")}
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={backToBook}
              style={styles.emptyButton}
            >
              <Text style={styles.emptyButtonText}>Về chi tiết sách</Text>
            </Pressable>
            {player.error && (
              <Pressable
                onPress={() => {
                  void player.retry();
                }}
              >
                <Text style={{ color: C.accent }}>Thử lại</Text>
              </Pressable>
            )}
          </>
        ) : (
          <ActivityIndicator color={C.accent} />
        )}
      </SafeAreaView>
    );
  }

  const { book, chapter } = player;
  const coverWidth = Math.min(
    194,
    dimensions.width * 0.45,
    Math.max(128, dimensions.height * 0.23),
  );
  const share = async () => {
    try {
      await Share.share({ message: `${book.title} — ${book.author}` });
    } catch {
      setShareNotice("Thiết bị này chưa hỗ trợ chia sẻ từ trình phát.");
    }
  };

  return (
    <SafeAreaView
      edges={["top", "bottom", "left", "right"]}
      style={styles.screen}
    >
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Pressable
          onPress={minimize}
          accessibilityRole="button"
          accessibilityLabel="Thu nhỏ trình phát"
          style={styles.headerButton}
        >
          <AppIcon name="chevronDown" size={27} color={C.text} />
        </Pressable>
        {/* <Text style={styles.headerLabel}>ĐANG NGHE</Text> */}
        <View style={styles.headerActions}>
          <Pressable
            onPress={() => {
              void share();
            }}
            accessibilityRole="button"
            accessibilityLabel="Chia sẻ tên sách"
            style={styles.headerButton}
          >
            {/* <AppIcon name="share" size={23} color={C.secondary} /> */}
          </Pressable>
          <Pressable
            onPress={minimize}
            accessibilityRole="button"
            accessibilityLabel="Tiếp tục nghe ở chế độ mini"
            style={styles.headerButton}
          >
            <AppIcon name="minimize" size={23} color={C.secondary} />
          </Pressable>
        </View>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <PlayerArtwork book={book} width={coverWidth} />
        <View style={styles.titleRow}>
          <View style={styles.titleBody}>
            <Text
              accessibilityRole="header"
              numberOfLines={2}
              style={styles.title}
            >
              {book.title}
            </Text>
            <Text numberOfLines={1} style={styles.author}>
              {book.author}
            </Text>
          </View>
          <Pressable
            onPress={() => setIsFavorite((prev) => !prev)}
            accessibilityRole="button"
            accessibilityLabel={
              isFavorite ? "Bỏ yêu thích" : "Thêm vào yêu thích"
            }
            accessibilityState={{ selected: isFavorite }}
            style={[styles.favoriteButton, isFavorite && styles.favoriteActive]}
          >
            <AppIcon
              name={isFavorite ? "heartFilled" : "heart"}
              size={22}
              color={isFavorite ? C.accent : C.muted}
            />
          </Pressable>
        </View>
        <Text numberOfLines={1} style={styles.chapter}>
          Chương {player.chapterIndex + 1} · {chapter.title}
        </Text>
        <View style={styles.timeline}>
          <PlayerSeekBar
            position={player.position}
            duration={chapter.duration}
            onSeek={player.seek}
          />
          <View style={styles.times}>
            <Text style={styles.time}>{formatAudioClock(player.position)}</Text>
            <Text style={styles.time}>
              −{formatAudioClock(chapter.duration - player.position)}
            </Text>
          </View>
        </View>
        <PlayerControls player={player} />
        <View style={styles.tools}>
          <Pressable
            onPress={() => setSheet("timer")}
            accessibilityRole="button"
            accessibilityLabel="Hẹn giờ tắt"
            style={styles.tool}
          >
            <AppIcon
              name="timer"
              size={27}
              color={player.sleepEndsAt !== null ? C.accent : C.secondary}
            />
            <Text style={styles.toolLabel}>
              {player.sleepEndsAt !== null
                ? `Còn ${Math.max(1, Math.ceil((player.sleepEndsAt - Date.now()) / 60000))} phút`
                : "Hẹn giờ tắt"}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setSheet("speed")}
            accessibilityRole="button"
            accessibilityLabel={`Tốc độ ${player.rate}x`}
            style={styles.tool}
          >
            <Text style={styles.rate}>{player.rate}x</Text>
            <Text style={styles.toolLabel}>Tốc độ</Text>
          </Pressable>
          <Pressable
            onPress={() => setSheet("chapters")}
            accessibilityRole="button"
            accessibilityLabel="Mở danh sách chương"
            style={styles.tool}
          >
            <AppIcon name="playlist" size={28} color={C.secondary} />
            <Text style={styles.toolLabel}>Danh sách</Text>
          </Pressable>
        </View>
        {(player.notice || shareNotice) && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Đóng thông báo trình phát"
            onPress={() => {
              player.clearNotice();
              setShareNotice(null);
            }}
            style={styles.notice}
          >
            <Text accessibilityRole="alert" style={styles.noticeText}>
              {player.notice || shareNotice}
            </Text>
            <AppIcon name="close" size={14} color={C.accent} />
          </Pressable>
        )}
        {(player.isLoading || player.isBuffering) && (
          <ActivityIndicator
            accessibilityLabel="Đang tải âm thanh"
            color={C.accent}
          />
        )}
        {(player.error || player.progressError) && (
          <Pressable
            onPress={() => {
              void player.retry();
            }}
            style={styles.notice}
            accessibilityRole="button"
          >
            <Text accessibilityRole="alert" style={styles.noticeText}>
              {player.error || player.progressError} · Thử lại
            </Text>
          </Pressable>
        )}
        {/* <Text style={styles.mockHint}>
          {player.savesProgress
            ? player.isSaving
              ? "Đang lưu tiến trình…"
              : "Tiến trình nghe được lưu theo tài khoản"
            : "Đăng nhập để lưu tiến trình nghe giữa các lần mở sách"}
        </Text> */}
      </ScrollView>
      <PlayerOptionsSheet
        sheet={sheet}
        onClose={() => setSheet(null)}
        player={player}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.background },
  header: {
    width: "100%",
    maxWidth: 520,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 13,
    paddingTop: 5,
  },
  headerButton: {
    width: 42,
    height: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  headerLabel: {
    color: C.muted,
    fontSize: 8,
    letterSpacing: 2,
    marginLeft: 38,
  },
  headerActions: { flexDirection: "row", gap: 2 },
  content: {
    width: "100%",
    maxWidth: 520,
    alignSelf: "center",
    paddingHorizontal: 24,
    paddingBottom: 24,
    flexGrow: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 4,
  },
  titleBody: { flex: 1 },
  title: {
    color: C.text,
    fontSize: 23,
    lineHeight: 31,
    fontWeight: "600",
    letterSpacing: -0.5,
  },
  author: { color: C.secondary, fontSize: 13, lineHeight: 22, marginTop: 10 },
  favoriteButton: {
    width: 41,
    height: 41,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  favoriteActive: {
    backgroundColor: C.accentLight,
    borderColor: "#FECDD3",
  },
  chapter: { color: C.secondary, fontSize: 10, marginTop: 8, lineHeight: 17 },
  timeline: { marginTop: 24 },
  times: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 3,
  },
  time: { color: C.secondary, fontSize: 11, fontVariant: ["tabular-nums"] },
  tools: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 25,
  },
  tool: {
    flex: 1,
    minHeight: 73,
    alignItems: "center",
    justifyContent: "center",
    gap: 11,
  },
  rate: { color: C.accent, fontSize: 23, lineHeight: 29 },
  toolLabel: { color: C.secondary, fontSize: 11 },
  mockHint: { color: C.muted, fontSize: 9, textAlign: "center", marginTop: 19 },
  notice: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    backgroundColor: C.accentLight,
    borderRadius: 10,
    marginTop: 15,
  },
  noticeText: { color: C.accentDark, fontSize: 11, lineHeight: 20, flex: 1 },
  empty: { alignItems: "center", justifyContent: "center", gap: 20 },
  emptyText: { color: C.secondary, fontSize: 14 },
  emptyButton: {
    paddingHorizontal: 23,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: C.accent,
  },
  emptyButtonText: { color: C.background, fontSize: 13, fontWeight: "600" },
});
