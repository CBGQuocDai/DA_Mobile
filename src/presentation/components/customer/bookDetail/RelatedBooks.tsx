import { ScrollView, StyleSheet, Text } from "react-native";
import { BookCard } from "@/presentation/components/customer/book/BookCard";
import type { BookPreview } from "@/presentation/components/customer/book/book.types";
import { CustomerTheme as C } from "@/shared/constants/customerTheme.constants";
import { DetailSection } from "./DetailSection";

export function RelatedBooks({
  books,
  onSelect,
}: {
  books: BookPreview[];
  onSelect: (book: BookPreview) => void;
}) {
  return (
    <DetailSection
      title="Sách liên quan"
      subtitle="Thêm một cuốn sách, thêm một góc nhìn mới."
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.books}
      >
        {books.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            width={143}
            onPress={() => onSelect(book)}
          />
        ))}
      </ScrollView>
      <Text style={styles.footnote}>AudioBook</Text>
    </DetailSection>
  );
}
const styles = StyleSheet.create({
  books: { gap: 17, paddingBottom: 10 },
  footnote: {
    color: "#B797A1",
    textAlign: "center",
    fontSize: 10,
    marginTop: 27,
    marginBottom: 10,
  },
});
