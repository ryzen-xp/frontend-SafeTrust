import { useGlobalAuthenticationStore } from '@/core/store/data';

type UserRole = 'admin' | 'hotel' | 'guest' | null;

export function getUserRole(): UserRole {
  // Read address from the persisted Zustand store
  const address = useGlobalAuthenticationStore.getState().address;
  
  if (!address) {
    return null;
  }

  if (address.startsWith('0xadmin') || address.includes('admin')) {
    return 'admin';
  } else if (address.startsWith('0xhotel') || address.includes('hotel')) {
    return 'hotel';
  } else {
    return 'guest';
  }
}