import { Link } from 'expo-router';
import { useRef, type ComponentRef } from 'react';
import { ActivityIndicator, Keyboard, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { AppIcon } from '@/presentation/components/common/AppIcon';
import { useAuthForm } from '@/presentation/hooks/customer/useAuthForm';
import { CustomerTheme as C } from '@/shared/constants/customerTheme.constants';
import { AuthFormField } from './AuthFormField';
import type { AuthFormMode } from './authForm.validation';

export function CustomerAuthForm({ mode }: { mode: AuthFormMode }) {
  const { values, errors, notice, generalError, registrationComplete, isBusy, isSubmitting, setField, submit, showPasswordRecovery } = useAuthForm(mode);
  const emailRef = useRef<ComponentRef<typeof TextInput>>(null);
  const nameRef = useRef<ComponentRef<typeof TextInput>>(null);
  const passwordRef = useRef<ComponentRef<typeof TextInput>>(null);
  const isRegister = mode === 'register';

  const handleSubmit = async () => {
    const firstError = await submit();
    if (firstError) ({ email: emailRef, fullName: nameRef, password: passwordRef })[firstError].current?.focus();
    else Keyboard.dismiss();
  };

  if (registrationComplete) return (
    <View style={styles.form}>
      <Text accessibilityLiveRegion="polite" style={styles.noticeText}>{notice}</Text>
      <Link href="/(auth)/login" replace asChild>
        <Pressable accessibilityRole="link" style={styles.submit}><Text style={styles.submitText}>Đến trang đăng nhập</Text></Pressable>
      </Link>
    </View>
  );

  return (
    <View style={styles.form}>
      {generalError && <Text accessibilityRole="alert" style={styles.generalError}>{generalError}</Text>}
      <AuthFormField ref={emailRef} label="Email" icon="mail" placeholder="Nhập địa chỉ email của bạn"
        editable={!isBusy}
        value={values.email} onChangeText={(value) => setField('email', value)} error={errors.email}
        inputMode="email" keyboardType="email-address" autoCapitalize="none" autoCorrect={false}
        autoComplete="email" textContentType="emailAddress" returnKeyType="next" submitBehavior="submit"
        onSubmitEditing={() => (isRegister ? nameRef : passwordRef).current?.focus()} />
      {isRegister && (
        <AuthFormField ref={nameRef} label="Họ tên" icon="user" placeholder="Nhập họ và tên đầy đủ của bạn"
          editable={!isBusy}
          value={values.fullName} onChangeText={(value) => setField('fullName', value)} error={errors.fullName}
          autoCapitalize="words" autoCorrect={false} autoComplete="name" textContentType="name"
          returnKeyType="next" submitBehavior="submit" onSubmitEditing={() => passwordRef.current?.focus()} />
      )}
      <AuthFormField ref={passwordRef} label="Mật khẩu" icon="lock" password
        editable={!isBusy}
        placeholder={isRegister ? 'Tối thiểu 6 ký tự' : 'Nhập mật khẩu của bạn'}
        value={values.password} onChangeText={(value) => setField('password', value)} error={errors.password}
        autoCapitalize="none" autoCorrect={false} autoComplete={isRegister ? 'new-password' : 'current-password'}
        textContentType={isRegister ? 'newPassword' : 'password'} returnKeyType="go" onSubmitEditing={handleSubmit}
        labelAction={!isRegister && (
          <Pressable disabled={isBusy} onPress={showPasswordRecovery} accessibilityRole="button" hitSlop={8}>
            <Text style={styles.forgotPassword}>Quên mật khẩu?</Text>
          </Pressable>
        )} />
      <Pressable accessibilityRole="button" disabled={isBusy} accessibilityState={{ disabled: isBusy, busy: isBusy }} onPress={handleSubmit}
        style={({ pressed }) => [styles.submit, isBusy && styles.disabled, pressed && styles.pressed]}>
        {isBusy && <ActivityIndicator color="#FFFFFF" size="small" />}
        <Text style={styles.submitText}>{isSubmitting ? (isRegister ? 'Đang tạo tài khoản...' : 'Đang đăng nhập...') : isRegister ? 'Đăng ký tài khoản' : 'Đăng nhập'}</Text>
        {!isBusy && <AppIcon name="arrowRight" color="#FFFFFF" size={17} />}
      </Pressable>
      {notice && (
        <View accessibilityLiveRegion="polite" style={styles.notice}>
          <AppIcon name="info" size={18} color={C.accent} />
          <Text style={styles.noticeText}>{notice}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  form: { gap: 18 },
  forgotPassword: { color: C.accent, fontSize: 11, fontWeight: '600', paddingVertical: 3 },
  submit: { minHeight: 52, marginTop: 6, paddingHorizontal: 18, paddingVertical: 14, borderRadius: 13, backgroundColor: C.accent, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: '0px 7px 16px rgba(225,29,72,0.18)' },
  submitText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  pressed: { backgroundColor: C.accentDark, transform: [{ scale: 0.99 }] },
  disabled: { opacity: 0.6 },
  generalError: { color: '#BE123C', fontSize: 12, lineHeight: 19, backgroundColor: C.accentLight, padding: 13, borderRadius: 12 },
  notice: { flexDirection: 'row', alignItems: 'flex-start', gap: 9, padding: 13, borderRadius: 12, backgroundColor: C.accentLight },
  noticeText: { flex: 1, fontSize: 11, lineHeight: 18, color: '#9B3F56' },
});
