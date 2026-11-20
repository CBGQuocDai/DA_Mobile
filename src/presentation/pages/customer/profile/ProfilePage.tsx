import { Link } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppIcon } from '@/presentation/components/common/AppIcon';
import { UserAvatar } from '@/presentation/components/customer/layout/UserAvatar';
import { useCustomerAuth } from '@/presentation/hooks/customer/useCustomerAuth';
import { CustomerTheme as C } from '@/shared/constants/customerTheme.constants';

export function ProfilePage() {
  const { user, isReady, error, logout, restoreSession } = useCustomerAuth();
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const run = async (action: () => Promise<void>) => {
    if (busy) return;
    setBusy(true);
    setActionError(null);
    try { await action(); }
    catch { setActionError('Không thể hoàn tất thao tác. Vui lòng thử lại.'); }
    finally { setBusy(false); }
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        {!isReady ? <ActivityIndicator color={C.accent} /> : (
          <>
            <UserAvatar user={user} size={82} />
            <Text accessibilityRole="header" style={styles.title}>{user ? user.fullName : 'Tủ sách dành riêng cho bạn'}</Text>
            <Text style={styles.subtitle}>{user ? user.email : 'Đăng nhập để bắt đầu hành trình lắng nghe của bạn.'}</Text>
            {(error || actionError) && <Text accessibilityRole="alert" style={styles.error}>{actionError || error}</Text>}
            {error && (
              <Pressable disabled={busy} onPress={() => { void run(restoreSession); }} style={styles.secondary} accessibilityRole="button">
                <Text style={styles.secondaryText}>Thử tải phiên lại</Text>
              </Pressable>
            )}
            {user || error ? (
              <Pressable disabled={busy} onPress={() => { void run(logout); }} accessibilityRole="button"
                style={[styles.primary, busy && styles.disabled]}>
                {busy ? <ActivityIndicator color="#FFFFFF" /> : <AppIcon name="logout" color="#FFFFFF" size={18} />}
                <Text style={styles.primaryText}>{busy ? 'Đang xử lý...' : 'Đăng xuất'}</Text>
              </Pressable>
            ) : (
              <>
                <Link href="/(auth)/login" asChild>
                  <Pressable disabled={busy} accessibilityRole="link" style={styles.primary}><Text style={styles.primaryText}>Đăng nhập</Text></Pressable>
                </Link>
                <Link href="/(auth)/register" asChild>
                  <Pressable disabled={busy} accessibilityRole="link" style={styles.secondary}><Text style={styles.secondaryText}>Tạo tài khoản mới</Text></Pressable>
                </Link>
              </>
            )}
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.surface },
  content: { flexGrow: 1, justifyContent: 'center', padding: 22 },
  card: { width: '100%', maxWidth: 440, alignSelf: 'center', alignItems: 'center', borderRadius: 25, padding: 26, backgroundColor: C.background, borderWidth: 1, borderColor: C.border },
  title: { color: C.text, fontSize: 23, lineHeight: 31, textAlign: 'center', fontWeight: '800', marginTop: 20 },
  subtitle: { color: C.secondary, fontSize: 12, lineHeight: 21, textAlign: 'center', marginTop: 8, marginBottom: 24 },
  primary: { width: '100%', minHeight: 50, padding: 14, marginTop: 9, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9, borderRadius: 13, backgroundColor: C.accent },
  primaryText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  secondary: { width: '100%', minHeight: 46, alignItems: 'center', justifyContent: 'center', borderRadius: 13, marginTop: 9, padding: 12, backgroundColor: C.accentLight },
  secondaryText: { color: C.accent, fontSize: 12, fontWeight: '600' },
  error: { color: C.accentDark, fontSize: 12, lineHeight: 20, textAlign: 'center', marginBottom: 12 },
  disabled: { opacity: 0.6 },
});
