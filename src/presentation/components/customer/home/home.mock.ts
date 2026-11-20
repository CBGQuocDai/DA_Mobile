import type { BookCategoryId, BookPreview } from '../book/book.types';

export const HOME_CATEGORIES: { id: BookCategoryId | 'all'; label: string }[] = [
  { id: 'all', label: 'Tất cả' },
  { id: 'literature', label: 'Văn học' },
  { id: 'growth', label: 'Phát triển bản thân' },
  { id: 'mindfulness', label: 'Tâm lý · Chữa lành' },
  { id: 'business', label: 'Kinh doanh' },
];

export const HOME_BOOKS: BookPreview[] = [
  {
    id: 'nha-gia-kim', title: 'Nhà giả kim', coverTitle: 'Nhà\ngiả kim', author: 'Paulo Coelho',
    category: 'literature', categoryLabel: 'Văn học', rating: 4.9, duration: '4 giờ 36 phút', price: 49000,
    description: 'Theo chân chàng chăn cừu Santiago trên hành trình đi tìm kho báu. Một câu chuyện dịu dàng về ước mơ, những cuộc gặp gỡ và tiếng nói bên trong mỗi chúng ta.',
    cover: { source: require('@/assets/images/book-covers/desert.svg'), background: '#F2E5C9', ink: '#253F4A' },
  },
  {
    id: 'dac-nhan-tam', title: 'Đắc nhân tâm', coverTitle: 'ĐẮC\nNHÂN TÂM', author: 'Dale Carnegie',
    category: 'growth', categoryLabel: 'Kỹ năng sống', rating: 4.8, duration: '8 giờ 12 phút', price: 69000,
    description: 'Những góc nhìn gần gũi về nghệ thuật lắng nghe, thấu hiểu và xây dựng các mối quan hệ. Bắt đầu thay đổi từ cách chúng ta đối xử với những người xung quanh.',
    cover: { source: require('@/assets/images/book-covers/connections.svg'), background: '#743B44', ink: '#FFF1D9' },
  },
  {
    id: 'cay-cam-ngot', title: 'Cây cam ngọt của tôi', coverTitle: 'Cây cam ngọt\ncủa tôi', author: 'José Mauro de Vasconcelos',
    category: 'literature', categoryLabel: 'Văn học', rating: 4.9, duration: '6 giờ 25 phút', price: 59000,
    description: 'Một thế giới tuổi thơ vừa trong trẻo vừa nhiều xúc cảm của cậu bé Zezé. Từ tình bạn với một cây cam nhỏ, câu chuyện mở ra những bài học về yêu thương và lòng trắc ẩn.',
    cover: { source: require('@/assets/images/book-covers/orange-tree.svg'), background: '#DCE9DB', ink: '#2F5748' },
  },
  {
    id: 'di-tim-le-song', title: 'Đi tìm lẽ sống', coverTitle: 'Đi tìm\nlẽ sống', author: 'Viktor E. Frankl',
    category: 'mindfulness', categoryLabel: 'Tâm lý', rating: 4.8, duration: '5 giờ 18 phút', price: 0,
    description: 'Suy ngẫm về khả năng tìm thấy ý nghĩa ngay cả trong những hoàn cảnh khó khăn. Một lời nhắc về hy vọng, lựa chọn và giá trị của cuộc sống.',
    cover: { source: require('@/assets/images/book-covers/mountains.svg'), background: '#E7E9DC', ink: '#374F4D' },
  },
  {
    id: 'tuoi-tre', title: 'Tuổi trẻ đáng giá bao nhiêu?', coverTitle: 'Tuổi trẻ\nđáng giá\nbao nhiêu?', author: 'Rosie Nguyễn',
    category: 'growth', categoryLabel: 'Phát triển bản thân', rating: 4.7, duration: '7 giờ 05 phút', price: 39000,
    description: 'Những chia sẻ chân thành về học hỏi, trải nghiệm và tìm con đường của riêng mình. Dành cho những ai muốn sống chủ động và khám phá thêm khả năng của bản thân.',
    cover: { source: require('@/assets/images/book-covers/journey.svg'), background: '#EFDDC8', ink: '#6D463C' },
  },
  {
    id: 'buoc-cham-lai', title: 'Bước chậm lại giữa thế gian vội vã', coverTitle: 'Bước chậm lại\ngiữa thế gian\nvội vã', author: 'Hae Min',
    category: 'mindfulness', categoryLabel: 'Chữa lành', rating: 4.8, duration: '3 giờ 42 phút', price: 0,
    description: 'Dành một khoảng lặng để quan sát cảm xúc và những điều bình dị quanh mình. Những trang sách nhẹ nhàng như một cuộc trò chuyện giúp ta sống chậm và hiểu mình hơn.',
    cover: { source: require('@/assets/images/book-covers/quiet-sea.svg'), background: '#DCE5EB', ink: '#345167' },
  },
  {
    id: 'babylon', title: 'Người giàu nhất thành Babylon', coverTitle: 'Người giàu\nnhất thành\nBabylon', author: 'George S. Clason',
    category: 'business', categoryLabel: 'Tài chính', rating: 4.7, duration: '4 giờ 50 phút', price: 45000,
    description: 'Những câu chuyện từ thành Babylon cổ đại gợi mở các nguyên tắc đơn giản về tiết kiệm, quản lý tiền bạc và vun đắp một cuộc sống vững vàng.',
    cover: { source: require('@/assets/images/book-covers/babylon.svg'), background: '#E9CE9C', ink: '#5E4633' },
  },
  {
    id: 'dam-bi-ghet', title: 'Dám bị ghét', coverTitle: 'Dám\nbị ghét', author: 'Ichiro Kishimi · Fumitake Koga',
    category: 'mindfulness', categoryLabel: 'Tâm lý', rating: 4.8, duration: '6 giờ 40 phút', price: 55000,
    description: 'Cuộc đối thoại về tự do, sự công nhận và lòng can đảm sống cuộc đời của chính mình. Một lời mời nhìn lại những niềm tin đang giới hạn chúng ta.',
    cover: { source: require('@/assets/images/book-covers/moon.svg'), background: '#E4DFEC', ink: '#504563' },
  },
];
