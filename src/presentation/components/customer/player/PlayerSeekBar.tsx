import { useRef } from 'react';
import { StyleSheet, View, type GestureResponderEvent } from 'react-native';
import { CustomerTheme as C } from '@/shared/constants/customerTheme.constants';

export interface PlayerSeekBarProps { position: number; duration: number; onSeek: (position: number) => void; }

export function PlayerSeekBar({ position, duration, onSeek }: PlayerSeekBarProps) {
  const width = useRef(1);
  const progress = duration ? Math.max(0, Math.min(position / duration, 1)) : 0;
  const seek = (event: GestureResponderEvent) => onSeek(Math.max(0, Math.min(event.nativeEvent.locationX / width.current, 1)) * duration);
  return <View onLayout={(event) => { width.current = event.nativeEvent.layout.width; }}
    onStartShouldSetResponder={() => true} onResponderGrant={seek} onResponderMove={seek}
    accessibilityRole="adjustable" accessibilityLabel="Vị trí phát"
    accessibilityValue={{ min: 0, max: duration, now: Math.floor(position) }}
    accessibilityActions={[{ name: 'increment', label: 'Tiến 10 giây' }, { name: 'decrement', label: 'Lùi 10 giây' }]}
    onAccessibilityAction={(event) => onSeek(position + (event.nativeEvent.actionName === 'increment' ? 10 : -10))}
    style={styles.touchArea}>
    <View pointerEvents="none" style={styles.track}><View style={[styles.fill, { width: `${progress * 100}%` }]} /></View>
    <View pointerEvents="none" style={[styles.thumb, { left: `${progress * 100}%` }]} />
  </View>;
}
const styles = StyleSheet.create({
  touchArea: { height: 32, justifyContent: 'center' },
  track: { height: 3, backgroundColor: C.border, borderRadius: 2, overflow: 'hidden' },
  fill: { height: 3, backgroundColor: C.accent },
  thumb: { position: 'absolute', width: 16, height: 16, borderRadius: 8, backgroundColor: C.accent, marginLeft: -8 },
});
