"use client";

import { Alert, Button, Spin } from 'antd';
import type { CSSProperties, ReactNode } from 'react';
import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { AccountInfo, AuthenticationResult } from '@azure/msal-browser';
import { EventType, PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider, useMsal } from '@azure/msal-react';
import { getAzureAdConfig } from '@/lib/env';

export type AuthContextValue = {
  isAuthenticated: boolean;
  isLoading: boolean;
  account: AccountInfo | null;
  roles: string[];
  error?: string;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
};

const defaultAuthContext: AuthContextValue = {
  isAuthenticated: true,
  isLoading: false,
  account: null,
  roles: ['local-dev'],
  signIn: async () => {},
  signOut: async () => {}
};

export const AuthContext = createContext<AuthContextValue>(defaultAuthContext);

export function useAuthContext() {
  return useContext(AuthContext);
}

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const config = getAzureAdConfig();

  const fallbackValue = useMemo<AuthContextValue>(
    () => ({
      ...defaultAuthContext,
      error: config ? undefined : 'Azure AD configuration not detected; continuing with local fallback authentication.'
    }),
    [config]
  );

  const instance = useMemo(() => {
    if (!config) {
      return null;
    }
    return new PublicClientApplication({
      auth: {
        clientId: config.clientId,
        authority: config.authority,
        redirectUri: config.redirectUri,
        postLogoutRedirectUri: config.postLogoutRedirectUri
      },
      cache: {
        cacheLocation: 'sessionStorage',
        storeAuthStateInCookie: true
      }
    });
  }, [config]);

  if (!config || !instance) {
    return <AuthContext.Provider value={fallbackValue}>{children}</AuthContext.Provider>;
  }

  return (
    <MsalProvider instance={instance}>
      <AuthStateBridge config={config}>{children}</AuthStateBridge>
    </MsalProvider>
  );
}

interface AuthStateBridgeProps {
  config: NonNullable<ReturnType<typeof getAzureAdConfig>>;
  children: ReactNode;
}

function AuthStateBridge({ config, children }: AuthStateBridgeProps) {
  const msal = useMsal();
  const loginTriggeredRef = useRef(false);
  const [state, setState] = useState<Omit<AuthContextValue, 'signIn' | 'signOut'>>({
    isAuthenticated: false,
    isLoading: true,
    account: null,
    roles: [],
    error: undefined
  });

  const requiredRoles = useMemo(
    () => config.requiredRoles.map((role) => role.toLowerCase()),
    [config.requiredRoles]
  );

  useEffect(() => {
    let mounted = true;

    const callbackId = msal.instance.addEventCallback((message) => {
      if (!mounted) {
        return;
      }

      if (message.eventType === EventType.LOGIN_SUCCESS && message.payload) {
        const payload = message.payload as AuthenticationResult;
        msal.instance.setActiveAccount(payload.account);
        const roles = extractRoles(payload.account);
        const allowed = satisfiesRoles(roles, requiredRoles);
        setState({
          isAuthenticated: allowed,
          isLoading: false,
          account: payload.account,
          roles,
          error: allowed ? undefined : buildRoleError(requiredRoles, roles)
        });
      }

      if (message.eventType === EventType.LOGIN_FAILURE) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: message.error?.message ?? 'Azure AD login failed.'
        }));
      }
    });

    const bootstrap = async () => {
      try {
        const result = await msal.instance.handleRedirectPromise();
        if (result?.account) {
          msal.instance.setActiveAccount(result.account);
        }

        const activeAccount =
          result?.account ??
          msal.instance.getActiveAccount() ??
          msal.instance.getAllAccounts()[0] ??
          null;

        if (!activeAccount) {
          if (!loginTriggeredRef.current) {
            loginTriggeredRef.current = true;
            await msal.instance.loginRedirect({
              scopes: config.scopes,
              prompt: 'select_account'
            });
          }
          setState((prev) => ({ ...prev, isLoading: true }));
          return;
        }

        const roles = extractRoles(activeAccount);
        const allowed = satisfiesRoles(roles, requiredRoles);
        setState({
          isAuthenticated: allowed,
          isLoading: false,
          account: activeAccount,
          roles,
          error: allowed ? undefined : buildRoleError(requiredRoles, roles)
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown authentication error.';
        setState({
          isAuthenticated: false,
          isLoading: false,
          account: null,
          roles: [],
          error: message
        });
      }
    };

    void bootstrap();

    return () => {
      mounted = false;
      if (callbackId) {
        msal.instance.removeEventCallback(callbackId);
      }
    };
  }, [msal.instance, config.scopes, requiredRoles]);

  const contextValue = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: state.isAuthenticated,
      isLoading: state.isLoading,
      account: state.account,
      roles: state.roles,
      error: state.error,
      signIn: async () => {
        loginTriggeredRef.current = true;
        await msal.instance.loginRedirect({ scopes: config.scopes, prompt: 'select_account' });
      },
      signOut: async () => {
        loginTriggeredRef.current = false;
        await msal.instance.logoutRedirect({ account: state.account ?? undefined });
      }
    }),
    [state, msal.instance, config.scopes]
  );

  if (state.isLoading) {
    return (
      <div style={loadingStyle}>
        <Spin size="large" />
      </div>
    );
  }

  if (state.error) {
    return (
      <div style={errorStyle}>
        <Alert
          type="error"
          showIcon
          message="Authentication required"
          description={state.error}
          action={
            <Button type="primary" onClick={() => contextValue.signIn()}>
              Retry Sign-In
            </Button>
          }
        />
      </div>
    );
  }

  if (!state.isAuthenticated) {
    return (
      <div style={errorStyle}>
        <Alert
          type="warning"
          showIcon
          message="Access restricted"
          description="Your account does not include the required MCMS roles. Please request access from Operations."
          action={<Button onClick={() => contextValue.signOut()}>Switch Account</Button>}
        />
      </div>
    );
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

const loadingStyle: CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  background: 'var(--color-surface-canvas)',
  gap: 16
};

const errorStyle: CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: 'var(--color-surface-canvas)',
  padding: 24
};

function extractRoles(account: AccountInfo | null): string[] {
  if (!account) {
    return [];
  }
  const claims = account.idTokenClaims ?? {};
  const roles = new Set<string>();

  const roleClaim = (claims as Record<string, unknown>).roles;
  if (Array.isArray(roleClaim)) {
    for (const role of roleClaim) {
      if (typeof role === 'string') {
        roles.add(role.toLowerCase());
      }
    }
  }

  const groupClaim = (claims as Record<string, unknown>).groups;
  if (Array.isArray(groupClaim)) {
    for (const group of groupClaim) {
      if (typeof group === 'string') {
        roles.add(group.toLowerCase());
      }
    }
  }

  const appRoles = (claims as Record<string, unknown>)['appRoles'];
  if (Array.isArray(appRoles)) {
    for (const role of appRoles) {
      if (typeof role === 'string') {
        roles.add(role.toLowerCase());
      }
    }
  }

  return Array.from(roles);
}

function satisfiesRoles(granted: string[], required: string[]): boolean {
  if (required.length === 0) {
    return true;
  }
  const grantedSet = new Set(granted.map((role) => role.toLowerCase()));
  return required.some((role) => grantedSet.has(role));
}

function buildRoleError(required: string[], granted: string[]): string {
  if (required.length === 0) {
    return 'No MCMS role requirements configured.';
  }
  if (granted.length === 0) {
    return `Missing required MCMS role(s): ${required.join(', ')}.`;
  }
  return `Missing required MCMS role(s): ${required.join(', ')}. Current roles: ${granted.join(', ') || 'none'}.`;
}
