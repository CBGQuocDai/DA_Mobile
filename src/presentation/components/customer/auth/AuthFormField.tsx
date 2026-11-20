import { useId, useState, type ComponentRef, type ReactNode, type Ref } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { AppIcon, type AppIconName } from '@/presentation/components/common/AppIcon';
import { CustomerTheme as C } from '@/shared/constants/customerTheme.constants';

interface AuthFormFieldProps extends Omit<TextInputProps, 'style'> {
  label: string;
  icon: AppIconName;
  password?: boolean;
  error?: string;
  labelAction?: ReactNode;
  ref?: Ref<ComponentRef<typeof TextInput>>;
}

export function AuthFormField({ label, icon, password = false, error, labelAction, ref, onFocus, onBlur, editable = true, ...props }: AuthFormFieldProps) {
  const id = useId();
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);

  return (
    <View>
      <View style={styles.labelRow}>
        <Text nativeID={`${id}-label`} style={styles.label}>{label}</Text>
        {labelAction}
      </View>
      <View style={[styles.field, focused && styles.focusedField, Boolean(error) && styles.invalidField]}>
        <AppIcon name={icon} size={19} color={focused ? C.accent : '#9DA3AE'} />
        <TextInput ref={ref} {...props} editable={editable} style={styles.input} accessibilityLabel={label}
          accessibilityLabelledBy={`${id}-label`} accessibilityHint={error}
          nativeID={`auth-input-${id}`} selectionColor={C.accent} cursorColor={C.accent}
          placeholderTextColor="#A0A6B1" underlineColorAndroid="transparent"
          secureTextEntry={password && !visible}
          onFocus={(event) => { setFocused(true); onFocus?.(event); }}
          onBlur={(event) => { setFocused(false); onBlur?.(event); }} />
        {password && (
          <Pressable disabled={!editable} onPress={() => setVisible((previous) => !previous)} accessibilityRole="button"
            accessibilityLabel={visible ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'} accessibilityState={{ selected: visible }}
            style={styles.eye} hitSlop={4}>
            <AppIcon name={visible ? 'eyeOff' : 'eye'} color={C.secondary} size={19} />
          </Pressable>
        )}
      </View>
      {error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  labelRow: { minHeight: 23, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 7 },
  label: { fontSize: 12, fontWeight: '600', color: C.text },
  field: { minHeight: 52, flexDirection: 'row', alignItems: 'center', gap: 11, paddingLeft: 14, paddingRight: 5, borderRadius: 13, borderWidth: 1, borderColor: '#E4E7ED', backgroundColor: C.background },
  focusedField: { borderColor: C.accent, boxShadow: '0px 0px 0px 3px rgba(225,29,72,0.07)' },
  invalidField: { borderColor: '#F87171', backgroundColor: '#FFFBFC' },
  input: { flex: 1, minWidth: 0, minHeight: 50, paddingVertical: 12, paddingHorizontal: 0, color: C.text, fontSize: 14, outlineWidth: 0 },
  eye: { width: 40, height: 44, alignItems: 'center', justifyContent: 'center' },
  error: { color: '#DC3653', fontSize: 11, lineHeight: 17, marginTop: 6 },
});
