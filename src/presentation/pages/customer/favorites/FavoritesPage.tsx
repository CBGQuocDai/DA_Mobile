import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useMemo, useState } from "react";
import {
  FlatList,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppIcon } from "@/presentation/components/common/AppIcon";
import { FavoriteBookRow } from "@/presentation/components/customer/favorites/FavoriteBookRow";
import { SearchFeedback } from "@/presentation/components/customer/search/SearchFeedback";
import { SearchField } from "@/presentation/components/customer/search/SearchField";
import { useCustomerAuth } from "@/presentation/hooks/customer/useCustomerAuth";
import { useFavoriteBooks } from "@/presentation/hooks/customer/useFavoriteBooks";
import { toFavoritePreview } from "@/presentation/mappers/favorite.mapper";
import { bookDetailRoute } from "@/presentation/utils/bookDetail.utils";
import { CustomerTheme as C } from "@/shared/constants/customerTheme.constants";
import { filterFavoriteBooks } from "@/shared/utils/favorites.utils";

export function FavoritesPage() {
  const router = useRouter();
  const auth = useCustomerAuth();
  const favorites = useFavoriteBooks();
  const authenticated = auth.user && favorites.userId === auth.user.id;

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.screen}>
      <StatusBar style="dark" />
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.headingRow}>
            <Text accessibilityRole="header" style={styles.title}>
              Yêu thích
            </Text>
            {/* <View style={styles.headingIcon}>
              <AppIcon name="heartFilled" size={23} color={C.accent} />
            </View> */}
          </View>
          {/* <Text style={styles.subtitle}>
            Những cuốn sách bạn muốn giữ bên mình
          </Text> */}
        </View>
        {!auth.isReady ? (
          <View style={styles.center}>
            <SearchFeedback loading message="Đang kiểm tra phiên đăng nhập…" />
          </View>
        ) : !auth.user && auth.error ? (
          <View style={styles.center}>
            <SearchFeedback
              title="Chưa tải được phiên đăng nhập"
              message={auth.error}
              action="Thử tải phiên lại"
              onAction={() => {
                void auth.restoreSession();
              }}
            />
            <Pressable
              onPress={() => router.navigate("/(tabs)/profile")}
              accessibilityRole="button"
              style={styles.secondaryAction}
            >
              <Text style={styles.actionText}>Mở tài khoản</Text>
            </Pressable>
          </View>
        ) : !authenticated ? (
          <View style={styles.center}>
            <View style={styles.emptyIcon}>
              <AppIcon name="heart" size={34} color={C.accent} />
            </View>
            <SearchFeedback
              title="Tủ sách yêu thích"
              message="Đăng nhập để lưu sách và tìm lại bất cứ lúc nào."
              action="Đăng nhập"
              onAction={() =>
                router.push({
                  pathname: "/(auth)/login",
                  params: { returnTo: "/favorites" },
                })
              }
            />
            <Pressable
              onPress={() => router.navigate("/(tabs)/search")}
              accessibilityRole="button"
              style={styles.secondaryAction}
            >
              <Text style={styles.actionText}>Khám phá sách</Text>
            </Pressable>
          </View>
        ) : (
          <FavoritesContent key={favorites.sessionId} favorites={favorites} />
        )}
      </View>
    </SafeAreaView>
  );
}

function FavoritesContent({
  favorites,
}: {
  favorites: ReturnType<typeof useFavoriteBooks>;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const books = useMemo(
    () => filterFavoriteBooks(favorites.books ?? [], query, order),
    [favorites.books, query, order],
  );
  const total = favorites.books?.length ?? 0;
  const hasList = favorites.books !== null;

  return (
    <>
      <View style={styles.controls}>
        <SearchField
          value={query}
          onChange={setQuery}
          onSubmit={Keyboard.dismiss}
          placeholder="Tìm trong sách yêu thích…"
          label="Tìm trong sách yêu thích"
        />
        <View style={styles.listHeading}>
          <Text accessibilityLiveRegion="polite" style={styles.count}>
            {hasList
              ? query.trim()
                ? `${books.length}/${total} cuốn sách`
                : `${total} cuốn sách đã lưu`
              : "Sách đã lưu của bạn"}
          </Text>
          <Pressable
            onPress={() =>
              setOrder((previous) => (previous === "asc" ? "desc" : "asc"))
            }
            accessibilityRole="button"
            accessibilityLabel={`Sắp xếp tên sách ${order === "asc" ? "A đến Z" : "Z đến A"}, chạm để đổi thứ tự`}
            style={styles.sort}
          >
            <AppIcon name="list" size={15} color={C.secondary} />
            <Text style={styles.sortText}>
              {order === "asc" ? "Tên A–Z" : "Tên Z–A"}
            </Text>
          </Pressable>
        </View>
      </View>
      {favorites.notice && (
        <View style={styles.notice} accessibilityLiveRegion="polite">
          <Text style={styles.noticeText}>{favorites.notice}</Text>
        </View>
      )}
      <FlatList
        data={books}
        keyExtractor={(book) => String(book.id)}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
        refreshing={hasList && favorites.isLoading}
        onRefresh={() => {
          void favorites.reload();
        }}
        ListHeaderComponent={
          hasList && favorites.error ? (
            <SearchFeedback
              message={favorites.error}
              action="Thử tải danh sách lại"
              onAction={() => {
                void favorites.reload();
              }}
            />
          ) : undefined
        }
        renderItem={({ item }) => (
          <FavoriteBookRow
            book={item}
            state={favorites.states[String(item.id)]}
            onOpen={() => {
              Keyboard.dismiss();
              router.push(bookDetailRoute(toFavoritePreview(item)));
            }}
            onRemove={() => {
              void favorites.remove(String(item.id));
            }}
          />
        )}
        ListEmptyComponent={
          !hasList ? (
            favorites.error ? (
              <SearchFeedback
                title="Chưa tải được sách yêu thích"
                message={favorites.error}
                action="Thử tải danh sách lại"
                onAction={() => {
                  void favorites.reload();
                }}
              />
            ) : (
              <SearchFeedback loading message="Đang tải sách yêu thích…" />
            )
          ) : total > 0 && query.trim() ? (
            <SearchFeedback
              title="Không tìm thấy sách phù hợp"
              message="Thử tìm tên sách khác trong danh sách đã lưu."
              action="Xóa tìm kiếm"
              onAction={() => setQuery("")}
            />
          ) : (
            <View style={styles.empty}>
              <View style={styles.emptyIcon}>
                <AppIcon name="heart" size={34} color={C.accent} />
              </View>
              <SearchFeedback
                title="Bạn chưa lưu cuốn sách nào"
                message="Chạm vào biểu tượng trái tim ở chi tiết sách để lưu vào đây."
                action="Khám phá sách"
                onAction={() => router.navigate("/(tabs)/search")}
              />
            </View>
          )
        }
      />
    </>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.background },
  content: { flex: 1, width: "100%", maxWidth: 560, alignSelf: "center" },
  header: { paddingHorizontal: 22, paddingTop: 14, paddingBottom: 20, gap: 8 },
  headingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  title: {
    color: C.text,
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.8,
  },
  headingIcon: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: C.accentLight,
    alignItems: "center",
    justifyContent: "center",
  },
  subtitle: { color: C.secondary, fontSize: 13, lineHeight: 21 },
  controls: { paddingHorizontal: 22 },
  listHeading: {
    minHeight: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  count: { color: C.secondary, fontSize: 12, flex: 1 },
  sort: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingLeft: 10,
  },
  sortText: { color: C.secondary, fontSize: 12, fontWeight: "600" },
  list: { flex: 1 },
  listContent: { paddingTop: 2, paddingBottom: 24 },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 40,
  },
  empty: { alignItems: "center", paddingTop: 46 },
  emptyIcon: {
    width: 76,
    height: 76,
    borderRadius: 26,
    backgroundColor: C.accentLight,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryAction: {
    minHeight: 44,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  actionText: { color: C.accent, fontSize: 13, fontWeight: "600" },
  notice: {
    marginHorizontal: 22,
    marginBottom: 14,
    paddingHorizontal: 13,
    backgroundColor: C.accentLight,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  noticeText: {
    flex: 1,
    color: C.accentDark,
    fontSize: 12,
    lineHeight: 20,
    paddingVertical: 10,
  },
});
