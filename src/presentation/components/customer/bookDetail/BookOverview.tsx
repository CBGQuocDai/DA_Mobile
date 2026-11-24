import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { AppIcon } from "@/presentation/components/common/AppIcon";
import { BookCover } from "@/presentation/components/customer/book/BookCover";
import { formatListeningDuration } from "@/presentation/utils/bookDetail.utils";
import { CustomerTheme as C } from "@/shared/constants/customerTheme.constants";
import type { BookDetailPreview } from "./bookDetail.types";

interface Props {
  book: BookDetailPreview;
  isFavorite: boolean;
  isFavoriteBusy: boolean;
  isFavoriteDisabled: boolean;
  favoriteError: string | null;
  onToggleFavorite: () => void;
  onPreview: () => void;
  onViewReviews: () => void;
  averageRating: number;
  reviewCount: number;
}

export function BookOverview({
  book,
  isFavorite,
  isFavoriteBusy,
  isFavoriteDisabled,
  favoriteError,
  onToggleFavorite,
  onPreview,
  onViewReviews,
  averageRating,
  reviewCount,
}: Props) {
  const duration = book.chapters.reduce(
    (sum, chapter) => sum + chapter.duration,
    0,
  );
  const canListen =
    book.isDemo ||
    book.chapters.some(
      (chapter) =>
        chapter.canPlay &&
        chapter.status === "AUDIO_READY" &&
        chapter.audioUrl &&
        chapter.duration > 0,
    );
  return (
    <View>
      <View style={styles.artwork}>
        <View style={styles.outerCircle} />
        <View style={styles.innerCircle} />
        <View style={styles.cover}>
          <BookCover book={book} width={151} />
        </View>
        <View style={styles.audioBadge}>
          <AppIcon name="headphones" size={13} color={C.accent} />
          <Text style={styles.audioText}>SÁCH NÓI</Text>
        </View>
      </View>
      <View style={styles.previewLabel}>
        <View style={styles.previewDot} />
        <Text style={styles.previewText}>
          {book.isDemo
            ? "BẢN XEM TRƯỚC · NỘI DUNG MINH HỌA"
            : book.purchased
              ? "SÁCH TRONG THƯ VIỆN CỦA BẠN"
              : "NGHE THỬ 3 CHƯƠNG ĐẦU"}
        </Text>
      </View>
      <View style={styles.titleRow}>
        <View style={styles.titleBody}>
          {/* <Text style={styles.category}>{book.tags[0]?.toUpperCase()}</Text> */}
          <Text accessibilityRole="header" style={styles.title}>
            {book.title}
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={
            isFavorite ? "Bỏ yêu thích sách" : "Thêm sách vào yêu thích"
          }
          disabled={isFavoriteBusy || isFavoriteDisabled}
          accessibilityState={{
            selected: isFavorite,
            busy: isFavoriteBusy,
            disabled: isFavoriteBusy || isFavoriteDisabled,
          }}
          onPress={onToggleFavorite}
          style={[styles.favorite, isFavorite && styles.saved]}
        >
          {isFavoriteBusy ? (
            <ActivityIndicator color={C.accent} />
          ) : (
            <AppIcon
              name={isFavorite ? "heartFilled" : "heart"}
              size={21}
              color={isFavorite ? C.accent : C.secondary}
            />
          )}
        </Pressable>
      </View>
      {favoriteError && (
        <Text accessibilityRole="alert" style={styles.favoriteError}>
          {favoriteError}
        </Text>
      )}
      <Text style={styles.author}>
        Tác giả: <Text style={styles.authorName}>{book.author}</Text>
      </Text>
      <Text style={styles.voice}>Giọng đọc: {book.narrator}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Xem ${reviewCount} đánh giá, ${averageRating.toFixed(1)} trên 5 sao`}
        onPress={onViewReviews}
        style={styles.reviewLink}
      >
        <AppIcon name="star" size={15} color={C.gold} />
        <Text style={styles.rating}>{averageRating.toFixed(1)}</Text>
        {/* <Text style={styles.reviewCount}>
          ({reviewCount} đánh giá minh họa)
        </Text> */}
        <Text style={styles.reviewCount}>({reviewCount} đánh giá)</Text>
        <AppIcon name="chevronRight" size={12} color={C.secondary} />
      </Pressable>
      <View style={styles.stats}>
        <View style={styles.stat}>
          <AppIcon name="list" color={C.accent} size={18} />
          <Text style={styles.statValue}>{book.chapters.length} chương</Text>
          <Text style={styles.statLabel}>Nội dung</Text>
        </View>
        <View style={[styles.stat, styles.middleStat]}>
          <AppIcon name="clock" color={C.accent} size={18} />
          <Text style={styles.statValue}>
            {formatListeningDuration(duration)}
          </Text>
          <Text style={styles.statLabel}>Thời lượng</Text>
        </View>
        <View style={styles.stat}>
          <AppIcon name="headphones" color={C.accent} size={18} />
          <Text style={styles.statValue}>{book.language}</Text>
          <Text style={styles.statLabel}>Ngôn ngữ</Text>
        </View>
      </View>
      <Pressable
        accessibilityRole="button"
        disabled={!canListen}
        onPress={onPreview}
        style={({ pressed }) => [
          styles.listen,
          (pressed || !canListen) && styles.pressed,
        ]}
      >
        <AppIcon name="play" color="#FFFFFF" size={20} />
        <Text style={styles.listenText}>
          {!canListen
            ? "Audio chưa sẵn sàng"
            : book.purchased
              ? "Tiếp tục nghe sách"
              : "Nghe thử miễn phí"}
        </Text>
      </Pressable>
      {/* <Text style={styles.previewHint}>
        {book.purchased
          ? "Tiến trình nghe được lưu theo tài khoản của bạn."
          : "Khám phá 3 chương đầu trước khi chọn cuốn sách của bạn."}
      </Text> */}
    </View>
  );
}

const styles = StyleSheet.create({
  artwork: {
    height: 294,
    borderRadius: 25,
    backgroundColor: "#FFF4F3",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    marginTop: 5,
    marginBottom: 19,
  },
  outerCircle: {
    position: "absolute",
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: "#FCE8E5",
    top: 32,
  },
  innerCircle: {
    position: "absolute",
    width: 246,
    height: 246,
    borderRadius: 123,
    backgroundColor: "#FFF8F1",
    top: 69,
  },
  cover: { marginTop: -11, boxShadow: "8px 13px 20px rgba(95,53,40,0.12)" },
  audioBadge: {
    position: "absolute",
    bottom: 17,
    right: 15,
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    backgroundColor: C.background,
    borderRadius: 20,
    paddingHorizontal: 11,
    paddingVertical: 8,
  },
  audioText: {
    color: C.accent,
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 1,
  },
  previewLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 16,
  },
  previewDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: C.accent,
  },
  previewText: {
    color: "#A07B84",
    fontSize: 8,
    letterSpacing: 0.8,
    fontWeight: "600",
  },
  titleRow: { flexDirection: "row", gap: 10, alignItems: "flex-start" },
  titleBody: { flex: 1 },
  category: {
    color: C.accent,
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  title: {
    color: C.text,
    fontSize: 28,
    lineHeight: 35,
    fontWeight: "800",
    letterSpacing: -0.8,
  },
  favorite: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  saved: { backgroundColor: C.accentLight, borderColor: "#F5C6D1" },
  favoriteError: {
    color: C.accentDark,
    fontSize: 12,
    lineHeight: 19,
    marginTop: 8,
  },
  author: { color: C.secondary, fontSize: 12, lineHeight: 21, marginTop: 12 },
  authorName: { color: C.text, fontWeight: "600" },
  voice: { color: C.secondary, fontSize: 11, marginTop: 4 },
  reviewLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    minHeight: 42,
    marginTop: 3,
  },
  rating: { color: C.text, fontSize: 12, fontWeight: "700" },
  reviewCount: { color: C.secondary, fontSize: 11 },
  stats: {
    flexDirection: "row",
    backgroundColor: C.surface,
    borderRadius: 17,
    paddingVertical: 16,
    marginTop: 9,
    marginBottom: 20,
  },
  stat: { flex: 1, alignItems: "center", gap: 7, paddingHorizontal: 3 },
  middleStat: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#E6E8ED",
  },
  statValue: {
    color: C.text,
    fontSize: 10,
    fontWeight: "700",
    textAlign: "center",
  },
  statLabel: { color: C.secondary, fontSize: 9 },
  listen: {
    minHeight: 51,
    borderRadius: 14,
    backgroundColor: C.accent,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    boxShadow: "0px 5px 10px rgba(225,29,72,0.16)",
  },
  listenText: { color: "#FFFFFF", fontSize: 13, fontWeight: "700" },
  previewHint: {
    color: C.secondary,
    fontSize: 10,
    lineHeight: 18,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 22,
  },
  pressed: { opacity: 0.75 },
});
