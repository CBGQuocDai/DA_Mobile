import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppIcon } from '@/presentation/components/common/AppIcon';
import { formatBookPrice } from '@/presentation/utils/bookDetail.utils';
import { CustomerTheme as C } from '@/shared/constants/customerTheme.constants';

export function BookPurchaseBar({ price, notice, onBuy, onDismiss, includeBottomInset = true }: { price: number | null; notice: boolean; onBuy: () => void; onDismiss: () => void; includeBottomInset?: boolean }) {
  return <SafeAreaView edges={includeBottomInset ? ['bottom'] : []} style={styles.footer}>
    <View style={styles.content}>
      {notice && <View style={styles.notice}>
        <Text accessibilityRole="alert" style={styles.noticeText}>Đây là bản xem trước. Chưa tạo đơn hàng hay thực hiện thanh toán.</Text>
        <Pressable accessibilityRole="button" accessibilityLabel="Đóng thông báo mua sách" onPress={onDismiss} style={styles.close}><AppIcon name="close" color={C.accent} size={16} /></Pressable>
      </View>}
      <View style={styles.row}>
        <View style={styles.priceBody}><Text style={styles.priceLabel}>GIÁ TRỌN BỘ</Text><Text style={styles.price}>{formatBookPrice(price)}</Text></View>
        <Pressable onPress={onBuy} accessibilityRole="button" style={({ pressed }) => [styles.buy, pressed && styles.pressed]}>
          <AppIcon name={price === 0 ? 'headphones' : 'lock'} size={17} color="#FFFFFF" /><Text style={styles.buyText}>{price === 0 ? 'Thêm vào tủ sách' : 'Mua trọn bộ'}</Text>
        </Pressable>
      </View>
    </View>
  </SafeAreaView>;
}
const styles = StyleSheet.create({
  footer: { borderTopWidth: 1, borderColor: C.border, backgroundColor: C.background, boxShadow: '0px -4px 14px rgba(34,30,40,0.035)' },
  content: { width: '100%', maxWidth: 600, alignSelf: 'center', paddingHorizontal: 22, paddingTop: 13, paddingBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 18 },
  priceBody: { minWidth: 90 },
  priceLabel: { color: C.secondary, fontSize: 8, letterSpacing: 1, fontWeight: '600' },
  price: { color: C.accent, fontSize: 21, fontWeight: '800', marginTop: 4, letterSpacing: -0.4 },
  buy: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, minHeight: 49, borderRadius: 13, backgroundColor: C.accent },
  buyText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  pressed: { opacity: 0.7 },
  notice: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.accentLight, borderRadius: 11, paddingLeft: 12, marginBottom: 12 },
  noticeText: { color: C.accentDark, fontSize: 10, lineHeight: 19, flex: 1, paddingVertical: 9 },
  close: { minHeight: 42, width: 37, alignItems: 'center', justifyContent: 'center' },
});
