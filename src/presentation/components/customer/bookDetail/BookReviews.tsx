import { useId, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { AppIcon } from '@/presentation/components/common/AppIcon';
import type { useBookReviewsPreview } from '@/presentation/hooks/customer/useBookReviewsPreview';
import { CustomerTheme as C } from '@/shared/constants/customerTheme.constants';
import { DetailSection } from './DetailSection';

const dateFormatter = new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'Asia/Ho_Chi_Minh' });
const RATING_LABELS = ['Chạm để đánh giá', 'Rất không hài lòng', 'Chưa hài lòng', 'Bình thường', 'Hài lòng', 'Rất hài lòng'];

function Stars({ value, size = 12 }: { value: number; size?: number }) {
  return <View style={styles.stars} accessibilityLabel={`${value.toFixed(1)} trên 5 sao`}>{[1, 2, 3, 4, 5].map((star) => (
    <AppIcon key={star} name="star" size={size} color={star <= Math.round(value) ? C.gold : '#E1E4E9'} />
  ))}</View>;
}

export function BookReviews({ state }: { state: ReturnType<typeof useBookReviewsPreview> }) {
  const fieldId = useId();
  const [focused, setFocused] = useState(false);
  const { summary } = state;
  return (
    <DetailSection title="Đánh giá từ độc giả" count={summary.total}>
      <View style={styles.summary}>
        <View style={styles.score}>
          <Text style={styles.average}>{summary.average.toFixed(1)}<Text style={styles.outOf}> / 5</Text></Text>
          <Stars value={summary.average} size={14} />
          <Text style={styles.reviewCount}>{summary.total} đánh giá</Text>
        </View>
        <View style={styles.distribution}>{summary.distribution.map(({ rating, count }) => (
          <Pressable key={rating} accessibilityRole="button" accessibilityLabel={`Lọc ${rating} sao, ${count} đánh giá`} accessibilityState={{ selected: state.filter === rating }}
            onPress={() => state.setFilter(state.filter === rating ? 0 : rating)} style={styles.distributionRow}>
            <Text style={[styles.starNumber, state.filter === rating && styles.selectedText]}>{rating}</Text>
            <AppIcon name="star" size={9} color={C.gold} />
            <View style={styles.bar}><View style={[styles.barFill, { width: `${summary.total ? count / summary.total * 100 : 0}%` }]} /></View>
            <Text style={styles.barCount}>{count}</Text>
          </Pressable>
        ))}</View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
        {[0, 5, 4, 3, 2, 1].map((rating) => <Pressable key={rating} accessibilityRole="button" accessibilityState={{ selected: state.filter === rating }} onPress={() => state.setFilter(rating)}
          style={[styles.filter, state.filter === rating && styles.selectedFilter]}><Text style={[styles.filterText, state.filter === rating && styles.selectedText]}>{rating ? `${rating} sao` : 'Tất cả'}</Text></Pressable>)}
      </ScrollView>
      <View style={styles.commentsHeader}>
        <Text style={styles.commentsTitle}>Nhận xét ({state.total})</Text>
        <Pressable accessibilityRole="button" accessibilityLabel="Đổi thứ tự đánh giá" onPress={() => state.setSort(state.sort === 'newest' ? 'highest' : 'newest')} style={styles.sort}>
          <Text style={styles.sortText}>{state.sort === 'newest' ? 'Mới nhất' : 'Điểm cao nhất'}</Text><AppIcon name="chevronDown" size={12} color={C.secondary} />
        </Pressable>
      </View>
      {state.items.map((review) => (
        <View key={review.id} style={styles.review}>
          <View style={styles.reviewHeader}>
            <View style={styles.avatar}><Text style={styles.avatarText}>{review.name.trim().split(/\s+/).slice(-1)[0]?.charAt(0).toUpperCase()}</Text></View>
            <View style={styles.reviewer}>
              <Text style={styles.name}>{review.name}</Text>
              <View style={styles.reviewMetadata}><Stars value={review.rating} size={10} /><Text style={styles.date}>{dateFormatter.format(new Date(review.createdAt))}</Text></View>
            </View>
          </View>
          <Text style={styles.comment}>{review.comment}</Text>
          {review.verifiedPurchase && <View style={styles.verified}><AppIcon name="check" size={11} color="#338267" /><Text style={styles.verifiedText}>Đã mua sách</Text></View>}
        </View>
      ))}
      {!state.items.length && <View style={styles.empty}><AppIcon name="chat" size={28} color={C.muted} /><Text style={styles.emptyText}>Chưa có đánh giá {state.filter ? `${state.filter} sao` : 'nào'}.</Text>
        {!!state.filter && <Pressable accessibilityRole="button" onPress={() => state.setFilter(0)} style={styles.emptyReset}><Text style={styles.selectedText}>Xem tất cả đánh giá</Text></Pressable>}
      </View>}
      {state.items.length > 0 && <Text style={styles.shown}>Hiển thị {state.items.length} / {state.total} nhận xét</Text>}
      {state.hasMore && <Pressable accessibilityRole="button" onPress={state.loadMore} style={styles.loadMore}><Text style={styles.loadMoreText}>Xem thêm đánh giá</Text><AppIcon name="chevronDown" size={14} color={C.accent} /></Pressable>}

      <View style={styles.form}>
        <Text accessibilityRole="header" style={styles.formTitle}>Chia sẻ cảm nhận của bạn</Text>
        <Text style={styles.formSubtitle}>Đánh giá thử chỉ hiển thị trong phiên xem trước này.</Text>
        {state.submitted ? <View style={styles.success} accessibilityRole="alert"><AppIcon name="check" color="#338267" size={21} /><Text style={styles.successText}>Đã thêm đánh giá thử của bạn. Nội dung sẽ mất khi tải lại trang.</Text></View> : (
          <>
            <View style={styles.rateInput}>{[1, 2, 3, 4, 5].map((rating) => <Pressable key={rating} accessibilityRole="button" accessibilityLabel={`Chọn ${rating} sao`} accessibilityState={{ selected: state.rating === rating }}
              onPress={() => state.setRating(rating)} style={styles.rateButton}><AppIcon name="star" size={29} color={rating <= state.rating ? C.gold : '#DCE0E7'} /></Pressable>)}</View>
            <Text style={styles.ratingLabel}>{RATING_LABELS[state.rating]}</Text>
            <TextInput nativeID={`book-detail-review-${fieldId}`} accessibilityLabel="Nhận xét của bạn" value={state.comment} onChangeText={state.setComment}
              onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} multiline maxLength={1000} textAlignVertical="top" selectionColor={C.accent}
              placeholder="Điều gì trong cuốn sách khiến bạn nhớ nhất?" placeholderTextColor={C.muted} style={[styles.commentInput, focused && styles.focused]} />
            <Text style={styles.counter}>{state.comment.length}/1000 ký tự</Text>
            {state.error && <Text accessibilityRole="alert" style={styles.error}>{state.error}</Text>}
            <Pressable accessibilityRole="button" onPress={state.submit} style={styles.submit}><Text style={styles.submitText}>Gửi đánh giá thử</Text></Pressable>
          </>
        )}
      </View>
    </DetailSection>
  );
}

const styles = StyleSheet.create({
  stars: { flexDirection: 'row', gap: 2, alignItems: 'center' },
  summary: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.surface, borderRadius: 16, paddingVertical: 19, paddingHorizontal: 15, gap: 18 },
  score: { width: 91, alignItems: 'center', gap: 10 },
  average: { color: C.text, fontSize: 34, fontWeight: '800', letterSpacing: -1.5 },
  outOf: { color: C.muted, fontSize: 11, fontWeight: '400', letterSpacing: 0 },
  reviewCount: { color: C.secondary, fontSize: 9 },
  distribution: { flex: 1, gap: 2 },
  distributionRow: { flexDirection: 'row', alignItems: 'center', minHeight: 25, gap: 5 },
  starNumber: { color: C.secondary, fontSize: 9, width: 8 },
  bar: { flex: 1, height: 5, backgroundColor: '#E5E8ED', borderRadius: 3, overflow: 'hidden', marginHorizontal: 2 },
  barFill: { height: 5, backgroundColor: C.gold, borderRadius: 3 },
  barCount: { color: C.secondary, fontSize: 9, width: 12, textAlign: 'right' },
  filters: { gap: 7, paddingVertical: 18 },
  filter: { paddingVertical: 9, paddingHorizontal: 13, borderRadius: 18, borderWidth: 1, borderColor: C.border },
  selectedFilter: { backgroundColor: C.accentLight, borderColor: '#F3C4CF' },
  filterText: { color: C.secondary, fontSize: 10, fontWeight: '600' },
  selectedText: { color: C.accent },
  commentsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 1 },
  commentsTitle: { color: C.text, fontSize: 13, fontWeight: '700' },
  sort: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 10 },
  sortText: { color: C.secondary, fontSize: 10 },
  review: { paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: C.border },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: { width: 35, height: 35, borderRadius: 18, backgroundColor: '#F8E6E8', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#B4647A', fontSize: 13, fontWeight: '700' },
  reviewer: { flex: 1 },
  name: { color: C.text, fontSize: 11, fontWeight: '700' },
  reviewMetadata: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 5 },
  date: { color: C.muted, fontSize: 9 },
  comment: { color: C.secondary, fontSize: 12, lineHeight: 22, marginTop: 11 },
  verified: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 10 },
  verifiedText: { color: '#338267', fontSize: 9 },
  empty: { alignItems: 'center', paddingVertical: 28, gap: 10 },
  emptyText: { color: C.secondary, fontSize: 12 },
  emptyReset: { padding: 12 },
  shown: { color: C.muted, textAlign: 'center', fontSize: 9, marginTop: 15 },
  loadMore: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderColor: '#F3D7DE', borderWidth: 1, borderRadius: 12, paddingVertical: 13, marginTop: 15 },
  loadMoreText: { color: C.accent, fontSize: 11, fontWeight: '600' },
  form: { backgroundColor: '#FBF8F9', padding: 17, borderRadius: 15, marginTop: 24 },
  formTitle: { color: C.text, fontSize: 15, fontWeight: '700' },
  formSubtitle: { color: C.secondary, fontSize: 10, lineHeight: 18, marginTop: 6 },
  rateInput: { flexDirection: 'row', marginTop: 17, gap: 2 },
  rateButton: { minWidth: 40, minHeight: 42, justifyContent: 'center' },
  ratingLabel: { color: C.secondary, fontSize: 10, marginTop: 3, marginBottom: 14 },
  commentInput: { minHeight: 109, backgroundColor: C.background, borderWidth: 1, borderColor: C.border, borderRadius: 11, padding: 12, color: C.text, fontSize: 11, lineHeight: 21 },
  focused: { borderColor: C.accent },
  counter: { color: C.muted, fontSize: 9, textAlign: 'right', marginTop: 6 },
  error: { color: C.accentDark, fontSize: 10, lineHeight: 18, marginTop: 9 },
  submit: { minHeight: 44, backgroundColor: C.accent, alignItems: 'center', justifyContent: 'center', borderRadius: 11, marginTop: 13 },
  submitText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
  success: { flexDirection: 'row', gap: 10, alignItems: 'center', marginTop: 19 },
  successText: { color: '#338267', fontSize: 11, lineHeight: 20, flex: 1 },
});
