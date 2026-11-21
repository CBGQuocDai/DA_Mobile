import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { AppIcon } from "@/presentation/components/common/AppIcon";
import { BookCard } from "@/presentation/components/customer/book/BookCard";
import type { BookPreview } from "@/presentation/components/customer/book/book.types";
import { CustomerTheme as C } from "@/shared/constants/customerTheme.constants";
import type { CatalogCategory } from "@/shared/types/catalog.types";

interface DiscoverBooksProps {
  books: BookPreview[];
  categories: CatalogCategory[];
  category: number | null;
  isSearching: boolean;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  isCategoriesLoading: boolean;
  categoriesError: string | null;
  onRetryCategories: () => void;
  total: number;
  page: number;
  totalPage: number;
  onPageChange: (page: number) => void;
  onCategoryChange: (category: number | null) => void;
  onSelectBook: (book: BookPreview) => void;
  onClearFilters: () => void;
}

export function DiscoverBooks({
  books,
  categories,
  category,
  isSearching,
  isLoading,
  error,
  onRetry,
  isCategoriesLoading,
  categoriesError,
  onRetryCategories,
  total,
  page,
  totalPage,
  onPageChange,
  onCategoryChange,
  onSelectBook,
  onClearFilters,
}: DiscoverBooksProps) {
  const [width, setWidth] = useState(390);
  const cardWidth = (width - 44 - 17) / 2;

  return (
    <View
      style={styles.section}
      onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
    >
      <View style={styles.heading}>
        <View style={styles.headingText}>
          <Text accessibilityRole="header" style={styles.title}>
            {isSearching ? "Kết quả tìm kiếm" : "Khám phá sách"}
          </Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categories}
        keyboardShouldPersistTaps="handled"
      >
        {[{ id: null, name: "Tất cả" }, ...categories].map((item) => {
          const selected = category === item.id;
          return (
            <Pressable
              key={item.id ?? "all"}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => onCategoryChange(item.id)}
              style={({ pressed }) => [
                styles.category,
                selected && styles.selectedCategory,
                pressed && styles.pressed,
              ]}
            >
              <Text
                style={[
                  styles.categoryText,
                  selected && styles.selectedCategoryText,
                ]}
              >
                {item.name}
              </Text>
            </Pressable>
          );
        })}
        {isCategoriesLoading && (
          <ActivityIndicator
            color={C.accent}
            accessibilityLabel="Đang tải thể loại sách"
          />
        )}
      </ScrollView>

      {categoriesError && (
        <View style={styles.categoryError}>
          <Text accessibilityRole="alert" style={styles.emptyText}>
            {categoriesError}
          </Text>
          <Pressable
            onPress={onRetryCategories}
            accessibilityRole="button"
            style={styles.inlineRetry}
          >
            <Text style={styles.resetText}>Thử tải thể loại lại</Text>
          </Pressable>
        </View>
      )}

      {isLoading ? (
        <View style={styles.empty} accessibilityLiveRegion="polite">
          <ActivityIndicator color={C.accent} size="large" />
          <Text style={styles.emptyText}>Đang tải danh sách sách...</Text>
        </View>
      ) : error ? (
        <View style={styles.empty}>
          <Text accessibilityRole="alert" style={styles.emptyTitle}>
            {error}
          </Text>
          <Pressable
            onPress={onRetry}
            accessibilityRole="button"
            style={styles.resetButton}
          >
            <Text style={styles.resetText}>Thử tải sách lại</Text>
          </Pressable>
        </View>
      ) : books.length > 0 ? (
        <View style={styles.grid}>
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              width={cardWidth}
              onPress={() => onSelectBook(book)}
            />
          ))}
        </View>
      ) : (
        <View style={styles.empty} accessibilityLiveRegion="polite">
          <View style={styles.emptyIcon}>
            <AppIcon name="search" size={27} color={C.accent} />
          </View>
          <Text style={styles.emptyTitle}>Chưa tìm thấy cuốn sách phù hợp</Text>
          <Text style={styles.emptyText}>
            Thử một tên sách hoặc thể loại khác nhé.
          </Text>
          <Pressable
            onPress={onClearFilters}
            accessibilityRole="button"
            style={styles.resetButton}
          >
            <Text style={styles.resetText}>Khám phá tất cả sách</Text>
          </Pressable>
        </View>
      )}

      {!isLoading && !error && totalPage > 1 && (
        <View style={styles.pagination}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Trang sách trước"
            disabled={page === 0}
            accessibilityState={{ disabled: page === 0 }}
            onPress={() => onPageChange(page - 1)}
            style={[styles.pageButton, page === 0 && styles.disabled]}
          >
            <Text style={styles.resetText}>Trang trước</Text>
          </Pressable>
          <Text accessibilityLiveRegion="polite" style={styles.pageText}>
            {page + 1} / {totalPage}
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Trang sách tiếp theo"
            disabled={page + 1 >= totalPage}
            accessibilityState={{ disabled: page + 1 >= totalPage }}
            onPress={() => onPageChange(page + 1)}
            style={[
              styles.pageButton,
              page + 1 >= totalPage && styles.disabled,
            ]}
          >
            <Text style={styles.resetText}>Trang sau</Text>
          </Pressable>
        </View>
      )}

      <View style={styles.footer}>
        <AppIcon name="headphones" size={17} color="#C5A8B0" />
        <Text style={styles.footerText}>AudioBook</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginTop: 27, paddingBottom: 18 },
  heading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 22,
    gap: 8,
  },
  headingText: { flex: 1 },
  title: {
    color: C.text,
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.6,
  },
  subtitle: { color: C.secondary, fontSize: 10, lineHeight: 17, marginTop: 4 },
  viewAll: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    minHeight: 40,
  },
  viewAllText: { color: C.accent, fontSize: 10, fontWeight: "600" },
  categories: {
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 22,
    gap: 8,
  },
  category: {
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "#F5F6F8",
  },
  selectedCategory: {
    backgroundColor: C.accent,
    boxShadow: "0px 3px 8px rgba(225,29,72,0.12)",
  },
  categoryText: { color: C.secondary, fontSize: 11, fontWeight: "600" },
  selectedCategoryText: { color: "#FFFFFF" },
  pressed: { opacity: 0.65 },
  grid: {
    paddingHorizontal: 22,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 20,
  },
  categoryError: {
    marginHorizontal: 22,
    alignItems: "center",
    marginBottom: 18,
  },
  inlineRetry: { paddingHorizontal: 14, paddingVertical: 10 },
  pagination: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    paddingHorizontal: 22,
    marginTop: 24,
  },
  pageButton: {
    backgroundColor: C.accentLight,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  pageText: { color: C.secondary, fontSize: 12 },
  disabled: { opacity: 0.4 },
  empty: { paddingVertical: 36, paddingHorizontal: 22, alignItems: "center" },
  emptyIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: C.accentLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  emptyTitle: {
    color: C.text,
    fontWeight: "700",
    fontSize: 14,
    textAlign: "center",
  },
  emptyText: {
    color: C.secondary,
    fontSize: 11,
    textAlign: "center",
    lineHeight: 19,
    marginTop: 8,
  },
  resetButton: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: C.accentLight,
    marginTop: 18,
  },
  resetText: { color: C.accent, fontSize: 12, fontWeight: "600" },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#F3F0F1",
    marginHorizontal: 22,
    marginTop: 28,
    paddingTop: 22,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  footerText: { color: "#AA9198", fontSize: 10 },
});
