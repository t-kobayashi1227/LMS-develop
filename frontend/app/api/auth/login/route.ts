import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { BACKEND_URL } from '@/lib/config';

export async function POST(request: Request) {
  const body = await request.json();

  const res = await fetch(`${BACKEND_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json(data, { status: res.status });
  }

  const cookieStore = await cookies();
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  };

  cookieStore.set('auth_token', data.data.token, cookieOptions);
  cookieStore.set('user_role', data.data.user.role, {
    ...cookieOptions,
    httpOnly: false, // middleware needs to read this
  });

  return NextResponse.json({ user: data.data.user });
}
