import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { AppIcon } from '@/presentation/components/common/AppIcon';
import { BrandLogo } from '@/presentation/components/customer/layout/BrandLogo';
import { UserAvatar } from '@/presentation/components/customer/layout/UserAvatar';
import type { CustomerUser } from '@/shared/types/auth.types';
import { CustomerTheme as C } from '@/shared/constants/customerTheme.constants';

interface HomeHeaderProps {
  query: string;
  onQueryChange: (value: string) => void;
  onSearch: () => void;
  onAccountPress: () => void;
  user?: CustomerUser | null;
}

export function HomeHeader({ query, onQueryChange, onSearch, onAccountPress, user }: HomeHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <BrandLogo />
        <Pressable accessibilityLabel={user ? `Mở tài khoản ${user.fullName}` : 'Mở trang đăng nhập'} accessibilityRole="button" onPress={onAccountPress}
          style={({ pressed }) => [styles.account, pressed && styles.pressed]}>
          <UserAvatar user={user} size={38} />
        </Pressable>
      </View>
      <View style={styles.search}>
        <AppIcon name="search" size={20} color={C.muted} />
        <TextInput
          accessibilityLabel="Tìm theo tên sách"
          placeholder="Tìm cuốn sách bạn yêu thích..."
          placeholderTextColor="#9A9FAA"
          style={styles.input}
          value={query}
          onChangeText={onQueryChange}
          onSubmitEditing={onSearch}
          returnKeyType="search"
          autoCorrect={false}
          autoCapitalize="none"
          clearButtonMode="never"
        />
        {query.length > 0 && (
          <Pressable accessibilityLabel="Xóa tìm kiếm" accessibilityRole="button" onPress={() => onQueryChange('')} hitSlop={10}>
            <AppIcon name="close" size={17} color={C.secondary} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 22, paddingTop: 8, paddingBottom: 18, gap: 16 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  account: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.border },
  pressed: { opacity: 0.6 },
  search: { height: 48, flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 15, paddingHorizontal: 15, backgroundColor: '#F5F6F8', borderWidth: 1, borderColor: '#EFF0F3' },
  input: { flex: 1, color: C.text, fontSize: 12, height: '100%', paddingVertical: 0 },
});
