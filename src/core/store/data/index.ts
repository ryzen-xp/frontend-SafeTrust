// frontend-SafeTrust/src/core/store/data/index.ts

import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";
import { AuthenticationGlobalStore } from "./@types/authentication.entity";
import { useGlobalAuthenticationSlice } from "./slices/authentication.slice";

export const useGlobalAuthenticationStore = create<AuthenticationGlobalStore>()(
  devtools(
    persist(useGlobalAuthenticationSlice, {
      name: "safetrust-wallet",
      storage: createJSONStorage(() => localStorage),
      partialize: ({ address, name }) => ({ address, name }), // never persist tokens
    }),
    { name: "AuthenticationStore" },
  ),
);