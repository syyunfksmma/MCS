import type { EspritApiKey, EspritJob } from '@/types/esprit';

export interface CreateEspritApiKeyRequest {
  description?: string;
  expiresInMinutes?: number;
}

export interface CreateEspritApiKeyResponse extends EspritApiKey {}

export interface TriggerEspritJobRequest {
  routingId: string;
  jobType: string;
  priority?: 'normal' | 'high';
  notes?: string;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || 'Esprit API 요청에 실패했습니다.');
  }

  return response.json() as Promise<T>;
}

export async function createEspritApiKey(
  payload: CreateEspritApiKeyRequest
): Promise<CreateEspritApiKeyResponse> {
  const response = await fetch('/api/esprit/api-key', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(payload)
  });

  return handleResponse<CreateEspritApiKeyResponse>(response);
}

export async function fetchEspritJobs(): Promise<EspritJob[]> {
  const response = await fetch('/api/esprit/jobs', {
    method: 'GET',
    cache: 'no-store',
    headers: {
      Accept: 'application/json'
    }
  });

  return handleResponse<EspritJob[]>(response);
}

export async function triggerEspritJob(
  payload: TriggerEspritJobRequest
): Promise<EspritJob> {
  const response = await fetch('/api/esprit/jobs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(payload)
  });

  return handleResponse<EspritJob>(response);
}
