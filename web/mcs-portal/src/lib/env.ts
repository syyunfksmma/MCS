export function getApiBaseUrl(): string | undefined {
  return process.env.MCMS_API_BASE_URL?.trim() || undefined;
}
