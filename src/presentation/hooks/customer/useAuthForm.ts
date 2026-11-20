import { useEffect, useRef, useState } from 'react';

import { AuthCancelledError, RegistrationCompleteError } from '@/application/auth/createCustomerAuth';
import { validateAuthForm, type AuthFormErrors, type AuthFormMode, type AuthFormValues } from '@/presentation/components/customer/auth/authForm.validation';
import { ApiError } from '@/shared/errors/ApiError';
import { useCustomerAuth } from './useCustomerAuth';

export function useAuthForm(mode: AuthFormMode) {
  const auth = useCustomerAuth();
  const [values, setValues] = useState<AuthFormValues>({ email: '', fullName: '', password: '' });
  const [errors, setErrors] = useState<AuthFormErrors>({});
  const [notice, setNotice] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const pending = useRef<AbortController | null>(null);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; pending.current?.abort(); };
  }, []);

  const setField = (field: keyof AuthFormValues, value: string) => {
    setValues((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({ ...previous, [field]: undefined }));
    setNotice(null);
    setGeneralError(null);
  };

  const submit = async (): Promise<keyof AuthFormValues | undefined> => {
    if (pending.current || !auth.isReady || registrationComplete) return;
    const nextErrors = validateAuthForm(values, mode);
    setErrors(nextErrors);
    const firstError = (Object.keys(nextErrors) as (keyof AuthFormValues)[])[0];
    if (firstError) return firstError;

    const controller = new AbortController();
    pending.current = controller;
    setIsSubmitting(true);
    setNotice(null);
    setGeneralError(null);
    try {
      await (mode === 'register' ? auth.register(values, controller.signal) : auth.login(values, controller.signal));
      if (mounted.current) setValues((previous) => ({ ...previous, password: '' }));
    } catch (error) {
      if (!mounted.current || controller.signal.aborted || error instanceof AuthCancelledError) return;
      if (error instanceof RegistrationCompleteError) {
        setRegistrationComplete(true);
        setValues((previous) => ({ ...previous, password: '' }));
        setNotice(error.message);
      } else {
        const message = error instanceof Error ? error.message : 'Không thể hoàn tất yêu cầu. Vui lòng thử lại.';
        setGeneralError(message);
        if (error instanceof ApiError && error.code === 4004) setErrors({ email: 'Địa chỉ email này đã được sử dụng.' });
      }
    } finally {
      pending.current = null;
      if (mounted.current) setIsSubmitting(false);
    }
  };

  const showPasswordRecovery = () => setNotice('Chức năng khôi phục mật khẩu sẽ được bổ sung ở bước tiếp theo.');

  return { values, errors, notice, generalError, registrationComplete, isSubmitting, isBusy: isSubmitting || !auth.isReady,
    setField, submit, showPasswordRecovery };
}
