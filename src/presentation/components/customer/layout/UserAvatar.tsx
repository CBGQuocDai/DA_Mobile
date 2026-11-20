import { Image } from 'expo-image';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppIcon } from '@/presentation/components/common/AppIcon';
import { CustomerTheme as C } from '@/shared/constants/customerTheme.constants';
import type { CustomerUser } from '@/shared/types/auth.types';

export function UserAvatar({ user, size = 40 }: { user?: CustomerUser | null; size?: number }) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const initials = user?.fullName.trim().split(/\s+/).slice(-2).map((part) => part[0]).join('').toUpperCase();
  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}>
      {user?.avatarUrl && failedUrl !== user.avatarUrl ? (
        <Image source={{ uri: user.avatarUrl }} style={StyleSheet.absoluteFill} alt="" recyclingKey={user.id}
          onError={() => setFailedUrl(user.avatarUrl ?? null)} />
      ) : initials ? <Text style={{ color: C.accent, fontSize: size * 0.32, fontWeight: '700' }}>{initials}</Text>
        : <AppIcon name="user" color={C.accent} size={size * 0.56} />}
    </View>
  );
}
const styles = StyleSheet.create({ avatar: { alignItems: 'center', justifyContent: 'center', overflow: 'hidden', backgroundColor: C.accentLight } });
