# Trustless Work Blocks

This directory contains vendored code from the Trustless Work library.

## Local modifications

The following modifications have been made to integrate with SafeTrust's wallet layer (as of FE-05):

### `wallet-kit/wallet-kit.ts`
- **Original behavior:** Created its own `StellarWalletsKit` instance with only Freighter and Albedo modules
- **Modified behavior:** Now delegates to SafeTrust's canonical `getWalletKit()` singleton via a Proxy
- **Reason:** Unify wallet kit instantiation to support all wallet types (xBull, Lobstr, etc.) and fix SSR safety

### `wallet-kit/WalletProvider.tsx`
- **Original behavior:** Managed its own React state with localStorage sync; read from `localStorage["address-wallet"]` (SafeTrust Zustand key that was never written)
- **Modified behavior:** Now reads wallet address and name directly from SafeTrust's persisted `useGlobalAuthenticationStore`
- **Reason:** Single source of truth; wallet now persists across refresh; eliminates broken localStorage fallback logic
- **API compatibility:** The `useWalletContext()` hook return shape remains unchanged

### `escrows/single-release/initialize-escrow/form/useInitializeEscrow.ts`
- **Removed:** Manual `localStorage.getItem("address-wallet")` fallback block (was unreliable)
- **Reason:** `WalletProvider` now guarantees wallet state is synced from the persistent store; fallback no longer needed

### `escrows/multi-release/initialize-escrow/form/useInitializeEscrow.ts`
- **Removed:** Manual `localStorage.getItem("address-wallet")` fallback block (was unreliable)
- **Reason:** `WalletProvider` now guarantees wallet state is synced from the persistent store; fallback no longer needed

## Notes

When updating or re-vendoring code from Trustless Work, be careful to preserve these local modifications:
- `wallet-kit.ts` should always delegate to SafeTrust's canonical kit
- `WalletProvider.tsx` should continue reading from `useGlobalAuthenticationStore`
- The `useInitializeEscrow.ts` files should not re-introduce the localStorage fallback
