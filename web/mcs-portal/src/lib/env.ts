export function getApiBaseUrl(): string | undefined {
  return process.env.MCMS_API_BASE_URL?.trim() || undefined;
}

export function getGrafanaEmbedUrl(): string | undefined {
  return process.env.NEXT_PUBLIC_GRAFANA_EMBED_URL?.trim() || undefined;
}

export function getGrafanaExternalUrl(): string | undefined {
  return process.env.NEXT_PUBLIC_GRAFANA_EXTERNAL_URL?.trim() || undefined;
}