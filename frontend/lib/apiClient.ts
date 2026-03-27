import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { BACKEND_URL } from './config';

export async function getToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get('auth_token')?.value;
}

export async function apiFetch<T>(
  path: string,
  options?: {
    token?: string;
    method?: string;
    body?: unknown;
    noAuth?: boolean;
  }
): Promise<T> {
  const token = options?.token ?? (options?.noAuth ? undefined : await getToken());

  const res = await fetch(`${BACKEND_URL}${path}`, {
    method: options?.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(options?.body ? { body: JSON.stringify(options.body) } : {}),
  });

  if (!res.ok) {
    if (res.status === 401 && !options?.noAuth) {
      const cookieStore = await cookies();
      cookieStore.delete('auth_token');
      redirect('/');
    }
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.message || `API error: ${res.status}`);
  }

  return res.json();
}

/** Fetch and unwrap { data: T } response */
export async function fetchData<T>(
  path: string,
  options?: Parameters<typeof apiFetch>[1]
): Promise<T> {
  const res = await apiFetch<{ data: T }>(path, options);
  return res.data;
}
