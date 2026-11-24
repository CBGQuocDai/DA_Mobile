import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { AppIcon } from "@/presentation/components/common/AppIcon";
import { BookCover } from "@/presentation/components/customer/book/BookCover";
import { toFavoritePreview } from "@/presentation/mappers/favorite.mapper";
import { formatBookPrice } from "@/presentation/utils/bookDetail.utils";
import { CustomerTheme as C } from "@/shared/constants/customerTheme.constants";
import type { CatalogBook } from "@/shared/types/catalog.types";
import type { FavoriteBookState } from "@/shared/types/favorite.types";

export function FavoriteBookRow({
  book,
  state,
  onOpen,
  onRemove,
}: {
  book: CatalogBook;
  state?: FavoriteBookState;
  onOpen: () => void;
  onRemove: () => void;
}) {
  const preview = toFavoritePreview(book);
  const available = book.status === "PUBLISHED";
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Pressable
          onPress={onOpen}
          disabled={!available}
          accessibilityRole="button"
          accessibilityLabel={`Xem chi tiết ${book.title}`}
          accessibilityState={{ disabled: !available }}
          style={({ pressed }) => [styles.book, pressed && styles.pressed]}
        >
          <BookCover book={preview} width={70} />
          <View style={styles.body}>
            <Text numberOfLines={3} style={styles.title}>
              {book.title}
            </Text>
            {preview.author ? (
              <Text numberOfLines={2} style={styles.author}>
                {preview.author}
              </Text>
            ) : null}
            <Text style={styles.price}>{formatBookPrice(preview.price)}</Text>
            {!available && (
              <Text style={styles.unavailable}>Hiện không khả dụng</Text>
            )}
          </View>
        </Pressable>
        <Pressable
          onPress={onRemove}
          disabled={state?.isBusy}
          accessibilityRole="button"
          accessibilityLabel={`Bỏ yêu thích ${book.title}`}
          accessibilityState={{
            disabled: Boolean(state?.isBusy),
            busy: Boolean(state?.isBusy),
          }}
          style={({ pressed }) => [styles.heart, pressed && styles.pressed]}
        >
          {state?.isBusy ? (
            <ActivityIndicator color={C.accent} />
          ) : (
            <AppIcon name="heartFilled" size={22} color={C.accent} />
          )}
        </Pressable>
      </View>
      {state?.error && (
        <View style={styles.errorRow}>
          <Text accessibilityRole="alert" style={styles.error}>
            {state.error}
          </Text>
          <Pressable
            onPress={onRemove}
            disabled={state.isBusy}
            accessibilityRole="button"
            accessibilityLabel={`Thử bỏ yêu thích ${book.title} lại`}
            style={styles.retry}
          >
            <Text style={styles.retryText}>Thử lại</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 22,
    marginBottom: 13,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 18,
    backgroundColor: C.background,
    padding: 14,
  },
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  book: { flex: 1, flexDirection: "row", alignItems: "center", gap: 15 },
  body: { flex: 1, minWidth: 0, gap: 7 },
  title: { color: C.text, fontSize: 14, fontWeight: "700", lineHeight: 21 },
  author: { color: C.secondary, fontSize: 12, lineHeight: 19 },
  price: { color: C.accentDark, fontSize: 12, fontWeight: "600" },
  unavailable: { color: C.secondary, fontSize: 11, lineHeight: 17 },
  heart: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: C.accentLight,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: { opacity: 0.65 },
  errorRow: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: C.border,
    gap: 4,
  },
  error: { color: C.accentDark, fontSize: 12, lineHeight: 19 },
  retry: {
    alignSelf: "flex-start",
    minHeight: 44,
    justifyContent: "center",
    paddingRight: 12,
  },
  retryText: { color: C.accent, fontSize: 12, fontWeight: "700" },
});
