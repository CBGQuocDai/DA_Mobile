import type { BookPreview } from '../book/book.types';
import type { BookDetailPreview, BookReviewPreview } from './bookDetail.types';

/** UI fixtures only. No detail, chapter, review, payment or audio API is called. */
export const BOOK_DETAIL_DEMOS: BookPreview[] = [
  {
    id: 'demo-nha-gia-kim', title: 'Nhà giả kim', coverTitle: 'Nhà\ngiả kim', author: 'Paulo Coelho',
    category: 'literature', categoryLabel: 'Văn học · Triết học', rating: 4.8, price: 79000,
    description: 'Có những hành trình bắt đầu từ một giấc mơ rất nhỏ. Với Santiago, đó là giấc mơ về một kho báu ở nơi xa, đưa cậu rời đồng cỏ quen thuộc để bước vào một thế giới rộng lớn hơn.\n\nQua những cuộc gặp gỡ và lựa chọn trên đường đi, câu chuyện gợi mở về lòng can đảm, sự kiên nhẫn và khả năng lắng nghe chính mình. Mỗi chặng đường đều mang theo một điều để khám phá.\n\nBản sách nói mang đến một nhịp kể chậm rãi, phù hợp cho những buổi đi bộ, chuyến xe hay khoảng thời gian yên tĩnh cuối ngày. Hãy dành cho mình một chút lắng nghe và bắt đầu hành trình của riêng bạn.',
    cover: { background: '#EFD5AE', ink: '#65442D' },
  },
  {
    id: 'demo-dac-nhan-tam', title: 'Đắc nhân tâm', coverTitle: 'Đắc\nnhân tâm', author: 'Dale Carnegie',
    category: 'growth', categoryLabel: 'Phát triển bản thân', rating: 4.8, price: 89000,
    description: 'Những góc nhìn gần gũi về sự quan tâm, cách lắng nghe và nghệ thuật kết nối với người khác. Qua các câu chuyện đời thường, cuốn sách mời chúng ta thử thay đổi những điều nhỏ trong cách giao tiếp.\n\nMỗi chương là một khoảng dừng để suy ngẫm về các mối quan hệ và cách đối xử tử tế hơn với những người xung quanh.',
    cover: { background: '#753B45', ink: '#FFF1D9' },
  },
  {
    id: 'demo-tuoi-tre', title: 'Tuổi trẻ đáng giá bao nhiêu', coverTitle: 'Tuổi trẻ\nđáng giá\nbao nhiêu', author: 'Rosie Nguyễn',
    category: 'growth', categoryLabel: 'Kỹ năng sống', rating: 4.8, price: 69000,
    description: 'Một lời mời học hỏi, đọc sách, đi xa và dành thời gian cho điều mình thực sự yêu thích. Những trải nghiệm được kể bằng giọng văn giản dị, như một cuộc trò chuyện với người bạn đồng hành.\n\nCuốn sách gợi mở nhiều cách để khám phá bản thân, nuôi dưỡng sự tò mò và chủ động hơn với những năm tháng tuổi trẻ.',
    cover: { background: '#DAE6DE', ink: '#355D4B' },
  },
  {
    id: 'demo-cay-cam', title: 'Cây cam ngọt của tôi', coverTitle: 'Cây cam\nngọt\ncủa tôi', author: 'José Mauro de Vasconcelos',
    category: 'literature', categoryLabel: 'Văn học · Tiểu thuyết', rating: 4.8, price: 75000,
    description: 'Một thế giới tuổi thơ giàu tưởng tượng, có những niềm vui nhỏ bé và cả điều khó nói thành lời. Câu chuyện dịu dàng mời người nghe nhìn lại sự cảm thông, tình yêu thương và sức mạnh của việc được lắng nghe.\n\nHãy cùng bước chậm lại qua từng chương và dành chỗ cho những cảm xúc rất đỗi con người.',
    cover: { background: '#DCE8C7', ink: '#486039' },
  },
];

const CHAPTER_TITLES = [
  'Lời mở đầu', 'Bắt đầu một hành trình', 'Lắng nghe điều mình mong muốn',
  'Những cuộc gặp gỡ trên đường', 'Lựa chọn và lòng can đảm', 'Khi ta học cách kiên nhẫn',
  'Nhìn lại những điều giản dị', 'Bài học từ những câu chuyện', 'Bước qua nỗi sợ',
  'Tìm thấy ý nghĩa của hành trình', 'Một góc nhìn mới', 'Lời kết: Hành trình tiếp nối',
];
const DURATIONS = [483, 1264, 1512, 1378, 1680, 1443, 1325, 1598, 1467, 1734, 1226, 702];

const REVIEWS: BookReviewPreview[] = [
  { id: 'review-8', name: 'Ngọc Anh', rating: 5, createdAt: '2026-11-19T10:00:00Z', verifiedPurchase: true, comment: 'Giọng đọc ấm và rõ ràng, rất hợp để nghe trên đường đi làm. Có những đoạn mình đã nghe lại lần thứ hai vì thấy một ý nghĩa khác.' },
  { id: 'review-7', name: 'Minh Khang', rating: 5, createdAt: '2026-11-17T09:00:00Z', verifiedPurchase: true, comment: 'Một trải nghiệm nghe dễ chịu. Cách chia chương vừa phải giúp mình duy trì thói quen nghe sách mỗi ngày.' },
  { id: 'review-6', name: 'Hà Linh', rating: 4, createdAt: '2026-11-15T14:00:00Z', verifiedPurchase: true, comment: 'Nội dung có nhiều điều để suy ngẫm. Mình thích nhịp đọc chậm ở những đoạn cần dừng lại cảm nhận.' },
  { id: 'review-5', name: 'Quang Huy', rating: 5, createdAt: '2026-11-12T08:00:00Z', verifiedPurchase: true, comment: 'Âm thanh rõ, lời kể gần gũi. Rất phù hợp cho một buổi tối yên tĩnh sau ngày dài.' },
  { id: 'review-4', name: 'Thảo Vy', rating: 5, createdAt: '2026-11-10T11:00:00Z', verifiedPurchase: true, comment: 'Nghe sách giúp mình có thêm một khoảng thời gian dành cho bản thân. Mình sẽ giới thiệu cuốn này cho bạn bè.' },
  { id: 'review-3', name: 'Đức Anh', rating: 4, createdAt: '2026-11-08T07:00:00Z', verifiedPurchase: false, comment: 'Phần nghe thử đủ để cảm nhận giọng đọc và cách kể chuyện. Mong có thêm nhiều cuốn cùng chủ đề.' },
  { id: 'review-2', name: 'Bảo Ngân', rating: 5, createdAt: '2026-11-05T12:00:00Z', verifiedPurchase: true, comment: 'Mỗi chương đều có một điều khiến mình muốn ghi lại. Một cuốn sách để nghe chậm và nghĩ lâu.' },
  { id: 'review-1', name: 'Hoàng Nam', rating: 5, createdAt: '2026-11-02T09:00:00Z', verifiedPurchase: true, comment: 'Rất thích cách kể chuyện tự nhiên. Mình thường nghe trong lúc đi bộ và thấy hành trình trở nên thú vị hơn.' },
];

export function createBookDetailPreview(id: string, identity?: Partial<BookPreview>): BookDetailPreview {
  const sample = BOOK_DETAIL_DEMOS.find((book) => book.id === id) ?? BOOK_DETAIL_DEMOS[0];
  const book = { ...sample, ...identity, id };
  return {
    ...book, isDemo: true, narrator: 'Thanh Bình', language: 'Tiếng Việt',
    tags: book.categoryLabel.split('·').map((tag) => tag.trim()).filter(Boolean),
    chapters: CHAPTER_TITLES.map((title, index) => ({ id: `${id}-chapter-${index + 1}`, title, duration: DURATIONS[index], isFree: index < 3 })),
    reviews: REVIEWS.map((review) => ({ ...review, id: `${id}-${review.id}` })),
    relatedBooks: BOOK_DETAIL_DEMOS.filter((item) => item.id !== id && item.title !== book.title),
  };
}
