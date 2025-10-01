export interface AzureAdConfig {
  clientId: string;
  tenantId: string;
  authority: string;
  redirectUri: string;
  postLogoutRedirectUri: string;
  scopes: string[];
  requiredRoles: string[];
}

export function getApiBaseUrl(): string | undefined {
  return (
    process.env.MCMS_API_BASE_URL?.trim() ||
    process.env.NEXT_PUBLIC_API_BASE_URL?.trim() ||
    undefined
  );
}

export function getGrafanaEmbedUrl(): string | undefined {
  return process.env.NEXT_PUBLIC_GRAFANA_EMBED_URL?.trim() || undefined;
}

export function getGrafanaExternalUrl(): string | undefined {
  return process.env.NEXT_PUBLIC_GRAFANA_EXTERNAL_URL?.trim() || undefined;
}

export function getAzureAdConfig(): AzureAdConfig | undefined {
  const clientId =
    process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_ID?.trim() ||
    process.env.AZURE_AD_CLIENT_ID?.trim();

  const tenantId =
    process.env.NEXT_PUBLIC_AZURE_AD_TENANT_ID?.trim() ||
    process.env.AZURE_AD_TENANT_ID?.trim();

  const rawAuthority =
    process.env.NEXT_PUBLIC_AZURE_AD_AUTHORITY?.trim() ||
    process.env.AZURE_AD_AUTHORITY?.trim();

  if (!clientId || !tenantId) {
    return undefined;
  }

  const authority = rawAuthority;
  if (!authority) {
    return undefined;
  }

  const redirectUri =
    process.env.NEXT_PUBLIC_AZURE_AD_REDIRECT_URI?.trim() ||
    process.env.AZURE_AD_REDIRECT_URI?.trim() ||
    '/';

  const postLogoutRedirectUri =
    process.env.NEXT_PUBLIC_AZURE_AD_POST_LOGOUT_REDIRECT_URI?.trim() ||
    process.env.AZURE_AD_POST_LOGOUT_REDIRECT_URI?.trim() ||
    redirectUri;

  const scopes = parseCsv(
    process.env.NEXT_PUBLIC_AZURE_AD_SCOPES ||
      process.env.AZURE_AD_SCOPES ||
      'User.Read'
  );

  const requiredRoles = parseCsv(
    process.env.NEXT_PUBLIC_MCMS_ALLOWED_ROLES ||
      process.env.MCMS_ALLOWED_ROLES ||
      ''
  );

  return {
    clientId,
    tenantId,
    authority,
    redirectUri,
    postLogoutRedirectUri,
    scopes,
    requiredRoles
  };
}

function parseCsv(value: string): string[] {
  return value
    .split(',')
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);
}

