import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useRef, useState, type ComponentRef } from "react";
import { Keyboard, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import type { BookPreview } from "@/presentation/components/customer/book/book.types";
import { DiscoverBooks } from "@/presentation/components/customer/home/DiscoverBooks";
import { HeroBookshelf } from "@/presentation/components/customer/home/HeroBookshelf";
import { HomeHeader } from "@/presentation/components/customer/home/HomeHeader";
import { useCatalog } from "@/presentation/hooks/customer/useCatalog";
import { useCustomerAuth } from "@/presentation/hooks/customer/useCustomerAuth";
import { useDiscoverBooks } from "@/presentation/hooks/customer/useDiscoverBooks";
import { bookDetailRoute } from "@/presentation/utils/bookDetail.utils";
import { CustomerTheme as C } from "@/shared/constants/customerTheme.constants";

export function HomePage() {
  const router = useRouter();
  const { user } = useCustomerAuth();
  const featured = useCatalog({ page: 0, size: 5 });
  const discovery = useDiscoverBooks();
  const [query, setQuery] = useState("");
  const scrollRef = useRef<ComponentRef<typeof ScrollView>>(null);
  const discoveryY = useRef(0);

  const selectBook = (book: BookPreview) => {
    Keyboard.dismiss();
    router.push(bookDetailRoute(book));
  };
  const clearFilters = () => {
    discovery.clearFilters();
    Keyboard.dismiss();
  };

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.screen}>
      <StatusBar style="dark" />
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <HomeHeader
            query={query}
            onQueryChange={setQuery}
            user={user}
            onSearch={() => {
              Keyboard.dismiss();
              router.navigate({
                pathname: "/(tabs)/search",
                params: { q: query.trim(), searchId: String(Date.now()) },
              });
            }}
            onAccountPress={() =>
              router.navigate(user ? "/(tabs)/profile" : "/(auth)/login")
            }
          />
          <HeroBookshelf
            books={featured.books}
            isLoading={featured.isLoading}
            error={featured.error}
            onRetry={featured.reload}
            onSelectBook={selectBook}
          />
          <View
            onLayout={(event) => {
              discoveryY.current = event.nativeEvent.layout.y;
            }}
          >
            <DiscoverBooks
              books={discovery.books}
              categories={discovery.categories}
              category={discovery.categoryId}
              isSearching={false}
              isLoading={discovery.isLoading}
              error={discovery.error}
              onRetry={discovery.reload}
              isCategoriesLoading={discovery.isCategoriesLoading}
              categoriesError={discovery.categoriesError}
              onRetryCategories={discovery.reloadCategories}
              total={discovery.total}
              page={discovery.page}
              totalPage={discovery.totalPage}
              onPageChange={(page) => {
                discovery.goToPage(page);
                scrollRef.current?.scrollTo({
                  y: discoveryY.current,
                  animated: true,
                });
              }}
              onCategoryChange={discovery.setCategory}
              onSelectBook={selectBook}
              onClearFilters={clearFilters}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.background },
  content: {
    width: "100%",
    maxWidth: 560,
    alignSelf: "center",
    paddingBottom: 16,
  },
});
