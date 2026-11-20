import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { AppIcon } from '@/presentation/components/common/AppIcon';
import { CustomerTheme as C } from '@/shared/constants/customerTheme.constants';

interface HomeHeaderProps {
  query: string;
  onQueryChange: (value: string) => void;
  onSearch: () => void;
  onAccountPress: () => void;
}

export function HomeHeader({ query, onQueryChange, onSearch, onAccountPress }: HomeHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.brand}>
          <View style={styles.brandIcon}><AppIcon name="headphones" color={C.accent} size={21} /></View>
          <Text accessibilityRole="header" style={styles.wordmark}>audio<Text style={styles.brandAccent}>book</Text><Text style={styles.brandDot}>.</Text></Text>
        </View>
        <Pressable accessibilityLabel="Mở trang cá nhân" accessibilityRole="button" onPress={onAccountPress}
          style={({ pressed }) => [styles.account, pressed && styles.pressed]}>
          <AppIcon name="user" size={23} color={C.text} />
        </Pressable>
      </View>
      <View style={styles.search}>
        <AppIcon name="search" size={20} color={C.muted} />
        <TextInput
          accessibilityLabel="Tìm sách hoặc tác giả"
          placeholder="Tìm sách, tác giả bạn yêu thích..."
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
  brand: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  brandIcon: { width: 31, height: 34, alignItems: 'center', justifyContent: 'center' },
  wordmark: { fontSize: 25, letterSpacing: -1.1, fontWeight: '800', color: C.text },
  brandAccent: { fontWeight: '600' },
  brandDot: { color: C.accent, fontSize: 29 },
  account: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.border },
  pressed: { opacity: 0.6 },
  search: { height: 48, flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 15, paddingHorizontal: 15, backgroundColor: '#F5F6F8', borderWidth: 1, borderColor: '#EFF0F3' },
  input: { flex: 1, color: C.text, fontSize: 12, height: '100%', paddingVertical: 0 },
});
