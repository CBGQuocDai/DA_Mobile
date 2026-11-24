import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { CustomerTheme as C } from "@/shared/constants/customerTheme.constants";

export function SearchFeedback({
  loading,
  title,
  message,
  action,
  onAction,
}: {
  loading?: boolean;
  title?: string;
  message?: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.container} accessibilityLiveRegion="polite">
      {loading && <ActivityIndicator size="large" color={C.accent} />}
      {title && <Text style={styles.title}>{title}</Text>}
      {message && <Text style={styles.message}>{message}</Text>}
      {action && onAction && (
        <Pressable
          onPress={onAction}
          accessibilityRole="button"
          style={styles.action}
        >
          <Text style={styles.actionText}>{action}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 22,
    paddingVertical: 28,
    alignItems: "center",
    gap: 10,
  },
  title: {
    color: C.text,
    fontWeight: "700",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 23,
  },
  message: {
    color: C.secondary,
    fontSize: 13,
    lineHeight: 21,
    textAlign: "center",
  },
  action: {
    minHeight: 44,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: C.accentLight,
    marginTop: 4,
  },
  actionText: { color: C.accent, fontSize: 13, fontWeight: "600" },
});
