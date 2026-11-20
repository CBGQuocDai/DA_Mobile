import { CustomerAuthForm } from '@/presentation/components/customer/auth/CustomerAuthForm';
import { CustomerAuthScreen } from '@/presentation/components/customer/auth/CustomerAuthScreen';

export function CustomerRegisterPage() {
  return (
    <CustomerAuthScreen mode="register">
      <CustomerAuthForm mode="register" />
    </CustomerAuthScreen>
  );
}
