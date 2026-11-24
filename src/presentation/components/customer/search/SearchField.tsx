import { Pressable, StyleSheet, TextInput, View } from "react-native";

import { AppIcon } from "@/presentation/components/common/AppIcon";
import { CustomerTheme as C } from "@/shared/constants/customerTheme.constants";

export function SearchField({
  value,
  onChange,
  onSubmit,
  placeholder,
  label,
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder: string;
  label: string;
}) {
  return (
    <View style={styles.field}>
      <AppIcon name="search" size={21} color={C.muted} />
      <TextInput
        value={value}
        onChangeText={onChange}
        onSubmitEditing={onSubmit}
        placeholder={placeholder}
        placeholderTextColor={C.muted}
        accessibilityLabel={label}
        returnKeyType="search"
        autoCorrect={false}
        autoCapitalize="none"
        clearButtonMode="never"
        style={styles.input}
      />
      {value.length > 0 && (
        <Pressable
          onPress={() => onChange("")}
          accessibilityRole="button"
          accessibilityLabel={`Xóa ${label.toLowerCase()}`}
          style={styles.clear}
        >
          <AppIcon name="close" size={18} color={C.secondary} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingLeft: 15,
    paddingRight: 5,
    borderRadius: 15,
    backgroundColor: "#F5F6F8",
    borderWidth: 1,
    borderColor: C.border,
  },
  input: {
    flex: 1,
    minWidth: 0,
    height: "100%",
    color: C.text,
    fontSize: 14,
    paddingVertical: 0,
  },
  clear: {
    width: 42,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
});
