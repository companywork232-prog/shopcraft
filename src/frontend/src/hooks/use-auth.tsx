import { useActor, useInternetIdentity } from "@caffeineai/core-infrastructure";
import type { Principal } from "@icp-sdk/core/principal";
import { useQuery } from "@tanstack/react-query";
import { type ReactNode, createContext, useContext } from "react";
import { createActor } from "../backend";
import type { Role } from "../backend";

interface AuthContextValue {
  isAuthenticated: boolean;
  principal: Principal | undefined;
  login: () => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  role: Role | null | undefined;
  isRoleLoading: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { identity, login, clear, loginStatus } = useInternetIdentity();
  const { actor, isFetching } = useActor(createActor);

  const isAuthenticated = !!identity && loginStatus === "success";
  const principal = identity?.getPrincipal();
  const isLoading = loginStatus === "logging-in";

  const { data: role, isLoading: isRoleLoading } = useQuery<Role | null>({
    queryKey: ["my-role", principal?.toText()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMyRole();
    },
    enabled: !!actor && !isFetching && isAuthenticated,
    staleTime: 60_000,
  });

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
        role: role ?? null,
        isRoleLoading,
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
