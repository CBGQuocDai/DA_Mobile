import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import { AppIcon } from "@/presentation/components/common/AppIcon";
import type { usePlayer } from "@/presentation/hooks/customer/usePlayer";
import { CustomerTheme as C } from "@/shared/constants/customerTheme.constants";

export function PlayerControls({
  player,
}: {
  player: ReturnType<typeof usePlayer>;
}) {
  const hasPrevious = player.chapterIndex > 0;
  const hasNext = player.chapterIndex + 1 < player.chapters.length;
  return (
    <View style={styles.controls}>
      <Pressable
        onPress={player.previous}
        disabled={!hasPrevious}
        accessibilityRole="button"
        accessibilityLabel="Chương trước"
        style={[styles.button, !hasPrevious && styles.disabled]}
      >
        <AppIcon name="skipPrevious" size={29} color={C.text} />
      </Pressable>
      <Pressable
        onPress={() => player.seek(player.position - 10)}
        accessibilityRole="button"
        accessibilityLabel="Lùi 10 giây"
        style={styles.button}
      >
        <AppIcon name="rewind10" size={30} color={C.secondary} />
      </Pressable>
      <View style={styles.playSurround}>
        <Pressable
          disabled={player.isLoading}
          onPress={player.toggle}
          accessibilityRole="button"
          accessibilityLabel={
            player.isPlaying ? "Tạm dừng phát" : "Tiếp tục phát"
          }
          style={styles.play}
        >
          {player.isLoading || player.isBuffering ? (
            <ActivityIndicator color={C.background} />
          ) : (
            <AppIcon
              name={player.isPlaying ? "pause" : "play"}
              size={33}
              color={C.background}
            />
          )}
        </Pressable>
      </View>
      <Pressable
        onPress={() => player.seek(player.position + 10)}
        accessibilityRole="button"
        accessibilityLabel="Tiến 10 giây"
        style={styles.button}
      >
        <AppIcon name="forward10" size={30} color={C.secondary} />
      </Pressable>
      <Pressable
        onPress={player.next}
        disabled={!hasNext}
        accessibilityRole="button"
        accessibilityLabel="Chương tiếp theo"
        style={[styles.button, !hasNext && styles.disabled]}
      >
        <AppIcon name="skipNext" size={29} color={C.text} />
      </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 5,
    marginTop: 23,
  },
  button: {
    flex: 1,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: { opacity: 0.3 },
  playSurround: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: C.accentLight,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 4,
  },
  play: {
    width: 65,
    height: 65,
    borderRadius: 33,
    backgroundColor: C.accent,
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0px 5px 14px rgba(225,29,72,0.18)",
  },
});
