import { CustomerAuthForm } from '@/presentation/components/customer/auth/CustomerAuthForm';
import { CustomerAuthScreen } from '@/presentation/components/customer/auth/CustomerAuthScreen';

export function CustomerLoginPage() {
  return (
    <CustomerAuthScreen mode="login">
      <CustomerAuthForm mode="login" />
    </CustomerAuthScreen>
  );
}
