import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { BACKEND_URL } from '@/lib/config';
import { getToken } from '@/lib/apiClient';

export async function POST() {
  const token = await getToken();

  if (token) {
    await fetch(`${BACKEND_URL}/logout`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    }).catch(() => {});
  }

  const cookieStore = await cookies();
  cookieStore.delete('auth_token');

  return NextResponse.json({ ok: true });
}
