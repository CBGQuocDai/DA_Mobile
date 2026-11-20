import { createCustomerAuth } from '@/application/auth/createCustomerAuth';
import { connectAuthSession } from '@/infrastructure/api/config/apiClient';
import { authService } from '@/infrastructure/api/services/auth.service';
import { tokenStorage } from '@/infrastructure/storage/tokenStorage';

export const customerAuth = createCustomerAuth(authService, tokenStorage);
connectAuthSession(customerAuth);
