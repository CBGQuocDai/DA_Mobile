import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useRef, useState, type ComponentRef } from 'react';
import { Keyboard, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BookPreviewSheet } from '@/presentation/components/customer/book/BookPreviewSheet';
import type { BookCategoryId, BookPreview } from '@/presentation/components/customer/book/book.types';
import { DiscoverBooks } from '@/presentation/components/customer/home/DiscoverBooks';
import { HeroBookshelf } from '@/presentation/components/customer/home/HeroBookshelf';
import { HomeHeader } from '@/presentation/components/customer/home/HomeHeader';
import { HOME_BOOKS } from '@/presentation/components/customer/home/home.mock';
import { useCatalog } from '@/presentation/hooks/customer/useCatalog';
import { CustomerTheme as C } from '@/shared/constants/customerTheme.constants';

const normalizeSearch = (value: string) =>
  value.toLocaleLowerCase('vi-VN').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');

export function HomePage() {
  const router = useRouter();
  const featured = useCatalog({ page: 0, size: 5 });
  const scrollRef = useRef<ComponentRef<typeof ScrollView>>(null);
  const discoveryY = useRef(0);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<BookCategoryId | 'all'>('all');
  const [selectedBook, setSelectedBook] = useState<BookPreview | null>(null);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const search = normalizeSearch(query.trim());
  const books = HOME_BOOKS.filter((book) =>
    (category === 'all' || book.category === category) && normalizeSearch(`${book.title} ${book.author}`).includes(search)
  );

  const selectBook = (book: BookPreview) => {
    Keyboard.dismiss();
    setSelectedBook(book);
  };
  const clearFilters = () => {
    setQuery('');
    setCategory('all');
    Keyboard.dismiss();
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.screen}>
      <StatusBar style="dark" />
      <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false} keyboardDismissMode="on-drag" keyboardShouldPersistTaps="handled">
        <View style={styles.content}>
          <HomeHeader query={query} onQueryChange={setQuery}
            onSearch={() => { Keyboard.dismiss(); scrollRef.current?.scrollTo({ y: discoveryY.current, animated: true }); }}
            onAccountPress={() => router.navigate('/(tabs)/profile')} />
          {!search && <HeroBookshelf books={featured.books} isLoading={featured.isLoading} error={featured.error}
            onRetry={featured.reload} onSelectBook={selectBook} />}
          <View onLayout={(event) => { discoveryY.current = event.nativeEvent.layout.y; }}>
            <DiscoverBooks books={books} category={category} isSearching={Boolean(search)}
              onCategoryChange={setCategory} onSelectBook={selectBook} onClearFilters={clearFilters} />
          </View>
        </View>
      </ScrollView>
      {selectedBook && (
        <BookPreviewSheet book={selectedBook} isFavorite={favoriteIds.includes(selectedBook.id)}
          onClose={() => setSelectedBook(null)}
          onToggleFavorite={() => setFavoriteIds((previous) => previous.includes(selectedBook.id)
            ? previous.filter((id) => id !== selectedBook.id)
            : [...previous, selectedBook.id])} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.background },
  content: { width: '100%', maxWidth: 560, alignSelf: 'center', paddingBottom: 16 },
});
