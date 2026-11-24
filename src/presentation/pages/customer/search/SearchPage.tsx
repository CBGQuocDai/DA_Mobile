import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  AppIcon,
  type AppIconName,
} from "@/presentation/components/common/AppIcon";
import { BookCard } from "@/presentation/components/customer/book/BookCard";
import type { BookPreview } from "@/presentation/components/customer/book/book.types";
import { SearchFeedback } from "@/presentation/components/customer/search/SearchFeedback";
import { SearchField } from "@/presentation/components/customer/search/SearchField";
import {
  SearchFilterSheet,
  type SearchFilter,
} from "@/presentation/components/customer/search/SearchFilterSheet";
import { useBookSearch } from "@/presentation/hooks/customer/useBookSearch";
import { bookDetailRoute } from "@/presentation/utils/bookDetail.utils";
import { CustomerTheme as C } from "@/shared/constants/customerTheme.constants";

function FilterButton({
  label,
  icon,
  selected,
  onPress,
}: {
  label: string;
  icon: AppIconName;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Lọc theo ${label.toLowerCase()}`}
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[styles.filterButton, selected && styles.activeFilter]}
    >
      <AppIcon
        name={icon}
        size={17}
        color={selected ? C.accent : C.secondary}
      />
      <Text style={[styles.filterText, selected && styles.activeText]}>
        {label}
      </Text>
      <AppIcon
        name="chevronDown"
        size={15}
        color={selected ? C.accent : C.secondary}
      />
    </Pressable>
  );
}

function SelectedFilter({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <Pressable
      onPress={onRemove}
      accessibilityRole="button"
      accessibilityLabel={`Bỏ lọc ${label}`}
      style={styles.selectedChip}
    >
      <Text style={styles.chipText} numberOfLines={1}>
        {label}
      </Text>
      <AppIcon name="close" size={15} color={C.accent} />
    </Pressable>
  );
}

export function SearchPage() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    q?: string | string[];
    searchId?: string | string[];
  }>();
  const incomingQuery =
    (Array.isArray(params.q) ? params.q[0] : params.q) ?? "";
  const searchId = Array.isArray(params.searchId)
    ? params.searchId[0]
    : params.searchId;
  const search = useBookSearch(incomingQuery);
  const { reset } = search;
  const incomingRequest = JSON.stringify([incomingQuery, searchId]);
  const lastIncomingRequest = useRef(incomingRequest);
  const list = useRef<FlatList<BookPreview>>(null);
  const [width, setWidth] = useState(390);
  const [filter, setFilter] = useState<SearchFilter | null>(null);
  const hasFilters = search.category !== null || search.author !== null;
  const hasSearch = Boolean(search.query.trim()) || hasFilters;
  const cardWidth = (width - 44 - 17) / 2;

  useEffect(() => {
    if (lastIncomingRequest.current !== incomingRequest) {
      lastIncomingRequest.current = incomingRequest;
      reset(incomingQuery);
      list.current?.scrollToOffset({ offset: 0, animated: false });
    }
  }, [incomingRequest, incomingQuery, reset]);
  useEffect(() => {
    list.current?.scrollToOffset({ offset: 0, animated: false });
  }, [search.keyword, search.category?.id, search.author?.id]);

  const selectBook = (book: BookPreview) => {
    Keyboard.dismiss();
    router.push(bookDetailRoute(book));
  };
  const openFilter = (value: SearchFilter) => {
    Keyboard.dismiss();
    setFilter(value);
  };
  const closeFilter = () => {
    Keyboard.dismiss();
    setFilter(null);
  };

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.screen}>
      <StatusBar style="dark" />
      <View
        style={styles.content}
        onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
      >
        <View style={styles.header}>
          <Text accessibilityRole="header" style={styles.title}>
            Tìm kiếm
          </Text>
          {/* <Text style={styles.subtitle}>Tìm cuốn sách dành cho bạn</Text> */}
          <SearchField
            value={search.query}
            onChange={search.setQuery}
            placeholder="Nhập tên sách…"
            label="Tìm tên sách"
            onSubmit={() => {
              search.submitQuery();
              Keyboard.dismiss();
              list.current?.scrollToOffset({ offset: 0, animated: false });
            }}
          />
          <View style={styles.filters}>
            <FilterButton
              label="Thể loại"
              icon="list"
              selected={search.category !== null}
              onPress={() => openFilter("category")}
            />
            <FilterButton
              label="Tác giả"
              icon="user"
              selected={search.author !== null}
              onPress={() => openFilter("author")}
            />
            {hasFilters && (
              <Pressable
                onPress={search.clearFilters}
                accessibilityRole="button"
                style={styles.clearFilters}
              >
                <Text style={styles.clearText}>Xóa bộ lọc</Text>
              </Pressable>
            )}
          </View>
          {hasFilters && (
            <View style={styles.selectedFilters}>
              {search.category && (
                <SelectedFilter
                  label={search.category.name}
                  onRemove={() => search.setCategory(null)}
                />
              )}
              {search.author && (
                <SelectedFilter
                  label={search.author.fullName}
                  onRemove={() => search.setAuthor(null)}
                />
              )}
            </View>
          )}
        </View>

        <FlatList
          ref={list}
          data={search.books}
          numColumns={2}
          keyExtractor={(book) => book.id}
          style={styles.list}
          columnWrapperStyle={styles.columns}
          contentContainerStyle={styles.results}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          refreshing={search.isRefreshing}
          onRefresh={search.reload}
          onEndReachedThreshold={0.35}
          onEndReached={() => {
            if (!search.isLoading && !search.isNextPageError) search.loadMore();
          }}
          ListHeaderComponent={
            <>
              {!hasSearch && (
                <>
                  <View style={styles.discoveryHeader}>
                    <Text style={styles.sectionTitle}>
                      Khám phá theo thể loại
                    </Text>
                    {/* <Text style={styles.hint}>
                      Chạm vào thể loại bạn muốn nghe
                    </Text> */}
                  </View>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoryChips}
                  >
                    {search.categories.map((item) => (
                      <Pressable
                        key={item.id}
                        onPress={() => search.setCategory(item)}
                        accessibilityRole="button"
                        style={styles.categoryChip}
                      >
                        <Text style={styles.categoryText}>{item.name}</Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                  {search.isCategoriesLoading && (
                    <SearchFeedback loading message="Đang tải thể loại…" />
                  )}
                  {search.categoriesError && (
                    <SearchFeedback
                      message={search.categoriesError}
                      action="Thử tải thể loại lại"
                      onAction={search.reloadCategories}
                    />
                  )}
                </>
              )}
              <View style={styles.resultHeading}>
                <Text accessibilityRole="header" style={styles.sectionTitle}>
                  {hasSearch ? "Kết quả tìm kiếm" : "Tất cả sách"}
                </Text>
                {!search.isLoading &&
                  (!search.error || search.books.length > 0) && (
                    <Text style={styles.count} accessibilityLiveRegion="polite">
                      {search.total} cuốn sách
                    </Text>
                  )}
              </View>
              {!search.isLoading && search.error && search.books.length > 0 && (
                <SearchFeedback
                  message={search.error}
                  action="Thử tải sách lại"
                  onAction={search.reload}
                />
              )}
            </>
          }
          renderItem={({ item }) => (
            <BookCard
              book={item}
              width={cardWidth}
              onPress={() => selectBook(item)}
            />
          )}
          ListEmptyComponent={
            search.isLoading ? (
              <SearchFeedback loading message="Đang tìm sách…" />
            ) : search.error ? (
              <SearchFeedback
                title="Chưa tải được sách"
                message={search.error}
                action="Thử tải sách lại"
                onAction={search.reload}
              />
            ) : (
              <View style={styles.empty}>
                <View style={styles.emptyIcon}>
                  <AppIcon name="search" size={28} color={C.accent} />
                </View>
                <SearchFeedback
                  title={
                    hasSearch
                      ? "Chưa tìm thấy cuốn sách phù hợp"
                      : "Chưa có sách để khám phá"
                  }
                  message={
                    hasSearch
                      ? "Thử tên sách khác hoặc bỏ bớt bộ lọc nhé."
                      : "Hãy quay lại sau để khám phá những cuốn sách mới."
                  }
                  action={hasSearch ? "Xóa tìm kiếm và bộ lọc" : undefined}
                  onAction={() => search.reset()}
                />
              </View>
            )
          }
        />
      </View>
      {filter !== null && (
        <SearchFilterSheet
          filter={filter}
          onClose={closeFilter}
          categories={search.categories}
          category={search.category}
          author={search.author}
          isCategoriesLoading={search.isCategoriesLoading}
          categoriesError={search.categoriesError}
          onRetryCategories={search.reloadCategories}
          onCategoryChange={search.setCategory}
          onAuthorChange={search.setAuthor}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.background },
  content: { flex: 1, width: "100%", maxWidth: 560, alignSelf: "center" },
  header: {
    paddingHorizontal: 22,
    paddingTop: 14,
    paddingBottom: 14,
    gap: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  title: {
    color: C.text,
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.8,
  },
  subtitle: { color: C.secondary, fontSize: 13, marginTop: -8, lineHeight: 20 },
  filters: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 9,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    minHeight: 44,
    paddingHorizontal: 13,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
  },
  activeFilter: { backgroundColor: C.accentLight, borderColor: "#FECDD3" },
  filterText: { color: C.secondary, fontSize: 12, fontWeight: "600" },
  activeText: { color: C.accent },
  clearFilters: {
    minHeight: 44,
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  clearText: { color: C.accent, fontSize: 12, fontWeight: "600" },
  selectedFilters: { flexDirection: "row", flexWrap: "wrap", gap: 7 },
  selectedChip: {
    maxWidth: "100%",
    minHeight: 40,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: C.accentLight,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  chipText: { color: C.accentDark, fontSize: 12, flexShrink: 1 },
  list: { flex: 1 },
  results: { paddingBottom: 24 },
  columns: { paddingHorizontal: 22, gap: 17, marginBottom: 18 },
  discoveryHeader: { paddingHorizontal: 22, paddingTop: 22, gap: 6 },
  sectionTitle: {
    color: C.text,
    fontSize: 17,
    fontWeight: "700",
    flexShrink: 1,
  },
  hint: { color: C.secondary, fontSize: 12, lineHeight: 19 },
  categoryChips: {
    paddingHorizontal: 22,
    paddingTop: 13,
    paddingBottom: 3,
    gap: 8,
  },
  categoryChip: {
    backgroundColor: C.accentLight,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    minHeight: 44,
    justifyContent: "center",
  },
  categoryText: { color: C.accentDark, fontSize: 12, fontWeight: "500" },
  resultHeading: {
    paddingHorizontal: 22,
    paddingTop: 23,
    paddingBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  count: { color: C.secondary, fontSize: 12 },
  empty: { alignItems: "center", paddingTop: 28 },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: C.accentLight,
    alignItems: "center",
    justifyContent: "center",
  },
  endText: {
    color: C.muted,
    textAlign: "center",
    fontSize: 12,
    paddingHorizontal: 22,
    paddingVertical: 20,
  },
});
