import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppIcon } from "@/presentation/components/common/AppIcon";
import { useAuthorSearch } from "@/presentation/hooks/customer/useAuthorSearch";
import { CustomerTheme as C } from "@/shared/constants/customerTheme.constants";
import type {
  CatalogAuthor,
  CatalogCategory,
} from "@/shared/types/catalog.types";
import { SearchFeedback } from "./SearchFeedback";
import { SearchField } from "./SearchField";

export type SearchFilter = "category" | "author";

function FilterOption({
  label,
  selected,
  onPress,
  leading,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  leading?: ReactNode;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={({ pressed }) => [
        styles.option,
        selected && styles.selected,
        pressed && styles.pressed,
      ]}
    >
      {leading}
      <Text style={[styles.optionText, selected && styles.selectedText]}>
        {label}
      </Text>
      {selected && <AppIcon name="check" size={19} color={C.accent} />}
    </Pressable>
  );
}

const normalize = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d");

function CategoryPicker({
  categories,
  selected,
  loading,
  error,
  onRetry,
  onSelect,
}: {
  categories: CatalogCategory[];
  selected: CatalogCategory | null;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onSelect: (category: CatalogCategory | null) => void;
}) {
  const [query, setQuery] = useState("");
  const list = useRef<FlatList<CatalogCategory>>(null);
  const items = categories.filter((item) =>
    normalize(item.name).includes(normalize(query)),
  );

  return (
    <>
      <View style={styles.search}>
        <SearchField
          value={query}
          onChange={(value) => {
            setQuery(value);
            list.current?.scrollToOffset({ offset: 0, animated: false });
          }}
          onSubmit={() => {}}
          placeholder="Tìm thể loại…"
          label="Tìm thể loại"
        />
      </View>
      <FlatList
        ref={list}
        data={items}
        keyExtractor={(item) => String(item.id)}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={styles.options}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <FilterOption
              label="Tất cả thể loại"
              selected={selected === null}
              onPress={() => onSelect(null)}
            />
            {error && (
              <SearchFeedback
                message={error}
                action="Thử tải thể loại lại"
                onAction={onRetry}
              />
            )}
          </>
        }
        renderItem={({ item }) => (
          <FilterOption
            label={item.name}
            selected={selected?.id === item.id}
            onPress={() => onSelect(item)}
          />
        )}
        ListEmptyComponent={
          loading ? (
            <SearchFeedback loading message="Đang tải thể loại…" />
          ) : !error ? (
            <SearchFeedback
              message={
                query.trim()
                  ? "Không tìm thấy thể loại phù hợp."
                  : "Chưa có thể loại sách."
              }
            />
          ) : undefined
        }
      />
    </>
  );
}

function AuthorPicker({
  selected,
  onSelect,
}: {
  selected: CatalogAuthor | null;
  onSelect: (author: CatalogAuthor | null) => void;
}) {
  const search = useAuthorSearch();
  const list = useRef<FlatList<CatalogAuthor>>(null);
  useEffect(() => {
    list.current?.scrollToOffset({ offset: 0, animated: false });
  }, [search.keyword]);

  return (
    <>
      <View style={styles.search}>
        <SearchField
          value={search.query}
          onChange={search.setQuery}
          onSubmit={search.submitQuery}
          placeholder="Nhập tên tác giả…"
          label="Tìm tên tác giả"
        />
      </View>
      <FlatList
        ref={list}
        data={search.authors}
        keyExtractor={(item) => String(item.id)}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.options}
        onEndReachedThreshold={0.3}
        onEndReached={() => {
          if (!search.isNextPageError) search.loadMore();
        }}
        ListHeaderComponent={
          <>
            <FilterOption
              label="Tất cả tác giả"
              selected={selected === null}
              onPress={() => onSelect(null)}
            />
            {!search.isLoading && search.error && search.authors.length > 0 && (
              <SearchFeedback
                message={search.error}
                action="Thử tải tác giả lại"
                onAction={search.reload}
              />
            )}
          </>
        }
        renderItem={({ item }) => (
          <FilterOption
            label={item.fullName}
            selected={selected?.id === item.id}
            onPress={() => onSelect(item)}
            leading={
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {item.fullName.trim().charAt(0).toUpperCase()}
                </Text>
              </View>
            }
          />
        )}
        ListEmptyComponent={
          search.isLoading ? (
            <SearchFeedback loading message="Đang tìm tác giả…" />
          ) : search.error ? (
            <SearchFeedback
              title="Chưa tải được tác giả"
              message={search.error}
              action="Thử tải tác giả lại"
              onAction={search.reload}
            />
          ) : (
            <SearchFeedback
              title="Không tìm thấy tác giả"
              message="Thử tìm bằng một tên khác nhé."
            />
          )
        }
        ListFooterComponent={
          search.authors.length > 0 && !search.isLoading ? (
            search.isFetchingNextPage ? (
              <SearchFeedback loading message="Đang tải thêm tác giả…" />
            ) : search.isNextPageError ? (
              <SearchFeedback
                message="Chưa tải được các tác giả tiếp theo."
                action="Thử tải thêm tác giả"
                onAction={search.loadMore}
              />
            ) : search.hasNextPage ? (
              <SearchFeedback
                action="Xem thêm tác giả"
                onAction={search.loadMore}
              />
            ) : undefined
          ) : undefined
        }
      />
    </>
  );
}

export function SearchFilterSheet({
  filter,
  onClose,
  categories,
  category,
  author,
  isCategoriesLoading,
  categoriesError,
  onRetryCategories,
  onCategoryChange,
  onAuthorChange,
}: {
  filter: SearchFilter;
  onClose: () => void;
  categories: CatalogCategory[];
  category: CatalogCategory | null;
  author: CatalogAuthor | null;
  isCategoriesLoading: boolean;
  categoriesError: string | null;
  onRetryCategories: () => void;
  onCategoryChange: (category: CatalogCategory | null) => void;
  onAuthorChange: (author: CatalogAuthor | null) => void;
}) {
  const { height } = useWindowDimensions();
  return (
    <Modal
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.overlay}
      >
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Đóng bộ lọc tìm kiếm"
        />
        <SafeAreaView
          edges={["bottom"]}
          style={[styles.sheet, { height: height * 0.76 }]}
          accessibilityViewIsModal
        >
          <View style={styles.handle} />
          <View style={styles.header}>
            <View style={styles.heading}>
              <Text accessibilityRole="header" style={styles.title}>
                {filter === "category" ? "Chọn thể loại" : "Chọn tác giả"}
              </Text>
              <Text style={styles.subtitle}>
                Chọn một mục để lọc danh sách sách
              </Text>
            </View>
            <Pressable
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Đóng bộ lọc"
              style={styles.close}
            >
              <AppIcon name="close" size={21} color={C.secondary} />
            </Pressable>
          </View>
          {filter === "category" ? (
            <CategoryPicker
              categories={categories}
              selected={category}
              loading={isCategoriesLoading}
              error={categoriesError}
              onRetry={onRetryCategories}
              onSelect={(value) => {
                onCategoryChange(value);
                onClose();
              }}
            />
          ) : (
            <AuthorPicker
              selected={author}
              onSelect={(value) => {
                onAuthorChange(value);
                onClose();
              }}
            />
          )}
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#1720334D",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  sheet: {
    width: "100%",
    maxWidth: 560,
    maxHeight: "100%",
    backgroundColor: C.background,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    overflow: "hidden",
  },
  handle: {
    alignSelf: "center",
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#D8DCE3",
    marginTop: 11,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 22,
    paddingVertical: 14,
  },
  heading: { flex: 1 },
  title: { color: C.text, fontSize: 20, fontWeight: "700" },
  subtitle: { color: C.secondary, fontSize: 12, marginTop: 5 },
  close: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  search: { paddingHorizontal: 22, paddingBottom: 14 },
  options: { paddingHorizontal: 14, paddingBottom: 20 },
  option: {
    minHeight: 54,
    paddingHorizontal: 14,
    paddingVertical: 13,
    marginBottom: 4,
    borderRadius: 13,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  optionText: { flex: 1, color: C.text, fontSize: 14, lineHeight: 21 },
  selected: { backgroundColor: C.accentLight },
  selectedText: { color: C.accent, fontWeight: "600" },
  pressed: { opacity: 0.65 },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: C.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: C.accentDark, fontSize: 14, fontWeight: "600" },
});
