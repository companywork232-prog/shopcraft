import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import type { Principal } from "@icp-sdk/core/principal";
import { type ReactNode, createContext, useContext } from "react";

interface AuthContextValue {
  isAuthenticated: boolean;
  principal: Principal | undefined;
  login: () => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { identity, login, clear, loginStatus } = useInternetIdentity();

  const isAuthenticated = !!identity && loginStatus === "success";
  const principal = identity?.getPrincipal();
  const isLoading = loginStatus === "logging-in";

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        principal,
        login: async () => {
          await login();
        },
        logout: clear,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
