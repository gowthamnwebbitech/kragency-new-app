import { getApi } from '@/api/apiMethods';
import { ProfileResponse } from '@/features/userProfile/profileTypes';

// Fetch profile
export const fetchProfileApi = () => getApi<ProfileResponse>('/customer/profile');
