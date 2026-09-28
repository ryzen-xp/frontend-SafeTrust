"use client";

import { createContext, useContext, ReactNode } from "react";
import { useGlobalAuthenticationStore } from "@/core/store/data";

/**
 * Type definition for the wallet context
 * Contains wallet address, name, and functions to manage wallet state
 */
type WalletContextType = {
  walletAddress: string | null;
  walletName: string | null;
  setWalletInfo: (address: string, name: string) => void;
  clearWalletInfo: () => void;
};

/**
 * Create the React context for wallet state management
 */
const WalletContext = createContext<WalletContextType | undefined>(undefined);

/**
 * Wallet Provider component that wraps the application
 * Manages wallet state by reading from and updating the persisted Zustand store
 *
 * LOCAL MODIFICATION (FE-05): Now reads from useGlobalAuthenticationStore instead of localStorage
 */
export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const address = useGlobalAuthenticationStore((s) => s.address);
  const name = useGlobalAuthenticationStore((s) => s.name);
  const connectWalletStore = useGlobalAuthenticationStore(
    (s) => s.connectWalletStore,
  );
  const disconnectWalletStore = useGlobalAuthenticationStore(
    (s) => s.disconnectWalletStore,
  );

  /**
   * Set wallet information by updating the Zustand store
   *
   * @param address - The wallet's public address
   * @param name - The name/identifier of the wallet (e.g., "Freighter", "Albedo")
   */
  const setWalletInfo = (address: string, name: string) => {
    connectWalletStore(address, name);
  };

  /**
   * Clear wallet information by updating the Zustand store
   */
  const clearWalletInfo = () => {
    disconnectWalletStore();
  };

  return (
    <WalletContext.Provider
      value={{
        walletAddress: address || null,
        walletName: name || null,
        setWalletInfo,
        clearWalletInfo,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

/**
 * Custom hook to access the wallet context
 * Provides wallet state and functions to components
 * Throws an error if used outside of WalletProvider
 */
export const useWalletContext = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWalletContext must be used within WalletProvider");
  }
  return context;
};

