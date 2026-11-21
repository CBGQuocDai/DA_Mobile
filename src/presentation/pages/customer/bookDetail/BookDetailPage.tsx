import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useRef, useState, type ComponentRef } from "react";
import {
  ActivityIndicator,
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppIcon } from "@/presentation/components/common/AppIcon";
import { BookDetailTabs } from "@/presentation/components/customer/bookDetail/BookDetailTabs";
import { BookIntroduction } from "@/presentation/components/customer/bookDetail/BookIntroduction";
import { BookOverview } from "@/presentation/components/customer/bookDetail/BookOverview";
import { BookPurchaseBar } from "@/presentation/components/customer/bookDetail/BookPurchaseBar";
import { BookReviews } from "@/presentation/components/customer/bookDetail/BookReviews";
import { ChapterList } from "@/presentation/components/customer/bookDetail/ChapterList";
import { RelatedBooks } from "@/presentation/components/customer/bookDetail/RelatedBooks";
import type {
  BookDetailPreview,
  BookDetailSection,
} from "@/presentation/components/customer/bookDetail/bookDetail.types";
import { useBookDetailInteractions } from "@/presentation/hooks/customer/useBookDetailInteractions";
import { useCustomerBookDetail } from "@/presentation/hooks/customer/useCustomerBookDetail";
import { useBookReviewsPreview } from "@/presentation/hooks/customer/useBookReviewsPreview";
import { bookDetailRoute } from "@/presentation/utils/bookDetail.utils";
import { CustomerTheme as C } from "@/shared/constants/customerTheme.constants";

export function BookDetailPage() {
  const params = useLocalSearchParams();
  const first = (value: string | string[] | undefined) =>
    Array.isArray(value) ? value[0] : value;
  const router = useRouter();
  const detail = useCustomerBookDetail(first(params.id) || "demo-nha-gia-kim");
  if (!detail.book)
    return (
      <SafeAreaView style={styles.screen}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 24,
            gap: 20,
          }}
        >
          {detail.isLoading ? (
            <ActivityIndicator color={C.accent} />
          ) : (
            <>
              <Text accessibilityRole="alert" style={{ color: C.secondary }}>
                {detail.error || "Không tìm thấy sách."}
              </Text>
              <Pressable onPress={detail.retry}>
                <Text style={{ color: C.accent }}>Thử tải lại</Text>
              </Pressable>
            </>
          )}
          <Pressable
            onPress={() =>
              router.canGoBack() ? router.back() : router.replace("/(tabs)")
            }
          >
            <Text style={{ color: C.accent }}>Quay lại</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  return <BookDetailContent key={detail.book.id} book={detail.book} />;
}

function BookDetailContent({ book }: { book: BookDetailPreview }) {
  const router = useRouter();
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  const anchors = useRef<Partial<Record<BookDetailSection, number>>>({});
  const tabHeight = useRef(53);
  const [section, setSection] = useState<BookDetailSection>("introduction");
  const playback = useBookDetailInteractions(book);
  const reviews = useBookReviewsPreview(book.reviews);
  const jumpTo = (target: BookDetailSection) => {
    Keyboard.dismiss();
    setSection(target);
    const y = anchors.current[target];
    if (y !== undefined)
      scroll.current?.scrollTo({
        y: Math.max(0, y - tabHeight.current),
        animated: true,
      });
  };
  const measure = (target: BookDetailSection, y: number) => {
    anchors.current[target] = y;
  };
  const trackSection = ({
    nativeEvent,
  }: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = nativeEvent;
    if (contentOffset.y + layoutMeasurement.height >= contentSize.height - 2) {
      setSection("related");
      return;
    }
    // Section headings have 28px of top padding below their measured wrapper.
    const y = contentOffset.y + tabHeight.current + 28;
    const current = (
      Object.entries(anchors.current) as [BookDetailSection, number][]
    )
      .filter(([, offset]) => offset <= y)
      .sort((a, b) => b[1] - a[1])[0];
    if (current) setSection(current[0]);
  };
  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.screen}>
      <StatusBar style="dark" />
      <View style={styles.toolbar}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Quay lại"
          onPress={() =>
            router.canGoBack() ? router.back() : router.replace("/(tabs)")
          }
          style={styles.toolbarButton}
        >
          <AppIcon name="chevronLeft" size={21} color={C.text} />
        </Pressable>
        <Text style={styles.toolbarTitle}>Chi tiết sách</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Về trang chủ"
          onPress={() => router.navigate("/(tabs)")}
          style={styles.toolbarButton}
        >
          <AppIcon name="home" size={21} color={C.text} />
        </Pressable>
      </View>
      <ScrollView
        ref={scroll}
        stickyHeaderIndices={[1]}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        scrollEventThrottle={16}
        onScroll={trackSection}
        onMomentumScrollEnd={trackSection}
        onScrollEndDrag={trackSection}
      >
        <View style={styles.content}>
          <BookOverview
            book={book}
            isFavorite={playback.isFavorite}
            onToggleFavorite={playback.toggleFavorite}
            onPreview={playback.startPreview}
            onViewReviews={() => jumpTo("reviews")}
            averageRating={reviews.summary.average}
            reviewCount={reviews.summary.total}
          />
        </View>
        <View
          style={styles.tabs}
          onLayout={(event) => {
            tabHeight.current = event.nativeEvent.layout.height;
          }}
        >
          <BookDetailTabs selected={section} onSelect={jumpTo} />
        </View>
        <View
          style={styles.content}
          onLayout={(event) =>
            measure("introduction", event.nativeEvent.layout.y)
          }
        >
          <BookIntroduction description={book.description} tags={book.tags} />
        </View>
        <View
          style={styles.content}
          onLayout={(event) => measure("chapters", event.nativeEvent.layout.y)}
        >
          <ChapterList chapters={book.chapters} playback={playback} />
        </View>
        <View
          style={styles.content}
          onLayout={(event) => measure("reviews", event.nativeEvent.layout.y)}
        >
          {/* {!book.isDemo && (
            <Text style={{ color: C.muted, fontSize: 11, marginTop: 20 }}>
              Đánh giá minh họa · chưa kết nối API
            </Text>
          )} */}
          <BookReviews state={reviews} />
        </View>
        <View
          style={styles.content}
          onLayout={(event) => measure("related", event.nativeEvent.layout.y)}
        >
          {!book.isDemo && (
            <Text style={{ color: C.muted, fontSize: 11, marginTop: 20 }}>
              Sách liên quan minh họa
            </Text>
          )}
          <RelatedBooks
            books={book.relatedBooks}
            onSelect={(related) => router.push(bookDetailRoute(related))}
          />
        </View>
      </ScrollView>
      <BookPurchaseBar
        price={book.price}
        notice={playback.purchaseNotice}
        onBuy={playback.openPurchaseNotice}
        onDismiss={playback.closePurchaseNotice}
        includeBottomInset={!playback.hasPlayer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.background },
  toolbar: {
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingTop: 4,
    paddingBottom: 8,
  },
  toolbarButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
  toolbarTitle: { color: C.text, fontSize: 14, fontWeight: "700" },
  content: {
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
    paddingHorizontal: 22,
  },
  tabs: {
    backgroundColor: C.background,
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
    paddingHorizontal: 18,
    zIndex: 5,
  },
});
