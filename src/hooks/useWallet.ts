"use client";

import { useCallback } from "react";
import type { ISupportedWallet } from "@creit.tech/stellar-wallets-kit";
import { getWalletKit, signXdr } from "@/lib/stellar/wallet-kit";
import { useGlobalAuthenticationStore } from "@/core/store/data";

/**
 * Hook to connect, disconnect, and sign transactions with a Stellar wallet.
 * Manages wallet state via the persisted Zustand authentication store.
 */
export function useWallet() {
  const address = useGlobalAuthenticationStore((s) => s.address);
  const name = useGlobalAuthenticationStore((s) => s.name);
  const connectWalletStore = useGlobalAuthenticationStore(
    (s) => s.connectWalletStore,
  );
  const disconnectWalletStore = useGlobalAuthenticationStore(
    (s) => s.disconnectWalletStore,
  );

  /**
   * Opens the wallet selection modal and connects the selected wallet.
   * Resolves with the connected wallet address on success.
   */
  const connect = useCallback(
    () =>
      new Promise<string>((resolve, reject) => {
        getWalletKit()
          .openModal({
            modalTitle: "Connect your Stellar wallet",
            onWalletSelected: async (option: ISupportedWallet) => {
              try {
                getWalletKit().setWallet(option.id);
                const { address } = await getWalletKit().getAddress();
                await connectWalletStore(address, option.name);
                resolve(address);
              } catch (err) {
                reject(err);
              }
            },
          })
          .catch(reject);
      }),
    [connectWalletStore],
  );

  /**
   * Disconnects the currently connected wallet and clears wallet state.
   */
  const disconnect = useCallback(async () => {
    await getWalletKit().disconnect();
    disconnectWalletStore();
  }, [disconnectWalletStore]);

  /**
   * Signs an unsigned XDR transaction string with the connected wallet.
   * Throws an error if no wallet is connected.
   */
  const sign = useCallback(
    (unsignedXdr: string) => {
      if (!address) throw new Error("No wallet connected");
      return signXdr(unsignedXdr, address);
    },
    [address],
  );

  return {
    address,
    name,
    isConnected: Boolean(address),
    connect,
    disconnect,
    sign,
  };
}
