export type AuthFormMode = 'login' | 'register';
export interface AuthFormValues {
  email: string;
  fullName: string;
  password: string;
}
export type AuthFormErrors = Partial<Record<keyof AuthFormValues, string>>;

/** Pure form validation; registration limits match BE RegisterRequest. */
export function validateAuthForm(values: AuthFormValues, mode: AuthFormMode): AuthFormErrors {
  const errors: AuthFormErrors = {};
  const email = values.email.trim();
  const name = values.fullName.trim();

  if (!email) errors.email = 'Vui lòng nhập địa chỉ email';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Email không hợp lệ (VD: user@example.com)';

  if (mode === 'register') {
    if (!name) errors.fullName = 'Vui lòng nhập họ và tên của bạn';
    else if (name.length < 2) errors.fullName = 'Họ và tên phải có ít nhất 2 ký tự';
  }

  if (!values.password) errors.password = 'Vui lòng nhập mật khẩu';
  else if (values.password.length < 6) errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
  else if (mode === 'register' && values.password.length > 100) errors.password = 'Mật khẩu không được quá 100 ký tự';

  return errors;
}
