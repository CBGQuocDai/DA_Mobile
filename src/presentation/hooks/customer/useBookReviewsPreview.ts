import { useState } from 'react';
import type { BookReviewPreview } from '@/presentation/components/customer/bookDetail/bookDetail.types';
import { reviewSummary } from '@/presentation/utils/bookDetail.utils';

export function useBookReviewsPreview(initial: BookReviewPreview[]) {
  const [reviews, setReviews] = useState(initial);
  const [filter, setFilter] = useState(0);
  const [sort, setSort] = useState<'newest' | 'highest'>('newest');
  const [limit, setLimit] = useState(3);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const filtered = reviews.filter((review) => !filter || review.rating === filter).sort((a, b) =>
    (sort === 'highest' ? b.rating - a.rating : 0) || Date.parse(b.createdAt) - Date.parse(a.createdAt));

  return {
    summary: reviewSummary(reviews), items: filtered.slice(0, limit), total: filtered.length,
    hasMore: limit < filtered.length, filter, sort, rating, comment, error, submitted,
    setFilter: (value: number) => { setFilter(value); setLimit(3); },
    setSort: (value: 'newest' | 'highest') => { setSort(value); setLimit(3); },
    setRating: (value: number) => { setRating(value); setError(null); },
    setComment: (value: string) => { setComment(value); setError(null); },
    loadMore: () => setLimit((value) => value + 3),
    submit: () => {
      if (submitted) return;
      if (!rating) { setError('Vui lòng chọn số sao cho cuốn sách.'); return; }
      if (comment.trim().length < 10) { setError('Vui lòng viết nhận xét từ 10 ký tự.'); return; }
      setReviews((previous) => [{ id: `preview-${Date.now()}`, name: 'Bạn', rating, comment: comment.trim(), createdAt: new Date().toISOString(), verifiedPurchase: false }, ...previous]);
      setSubmitted(true); setError(null); setComment(''); setFilter(0); setSort('newest'); setLimit(3);
    },
  };
}
