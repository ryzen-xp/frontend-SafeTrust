"use client";

/**
 * LOCAL MODIFICATION (see tw-blocks/README.md):
 * This file now delegates to the canonical SafeTrust wallet kit.
 * Original tw-blocks file created its own StellarWalletsKit instance.
 */

import { getWalletKit, signXdr, STELLAR_NETWORK } from "@/lib/stellar/wallet-kit";
import type { StellarWalletsKit } from "@creit.tech/stellar-wallets-kit";

/**
 * Lazy proxy that delegates all property accesses to the canonical getWalletKit() singleton.
 * This replaces the old eagerly-constructed StellarWalletsKit instance (Freighter+Albedo only).
 *
 * Safe to call at render time; never creates a second kit instance.
 */
export const kit = new Proxy({} as StellarWalletsKit, {
  get(_target, prop) {
    const instance = getWalletKit();
    const value = (instance as any)[prop];
    return typeof value === "function" ? value.bind(instance) : value;
  },
});

interface SignTransactionParams {
  unsignedTransaction: string;
  address: string;
}

/**
 * Sign Transaction
 * Delegates to the canonical signXdr function
 *
 * @param unsignedTransaction - The unsigned transaction
 * @param address - The address of the wallet
 */
export const signTransaction = async ({
  unsignedTransaction,
  address,
}: SignTransactionParams): Promise<string> =>
  signXdr(unsignedTransaction, address);

export { STELLAR_NETWORK };

