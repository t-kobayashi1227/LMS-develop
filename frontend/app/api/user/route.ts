import { NextResponse } from 'next/server';
import { BACKEND_URL } from '@/lib/config';
import { getToken } from '@/lib/apiClient';

export async function PUT(request: Request) {
  const token = await getToken();
  if (!token) {
    return NextResponse.json({ message: 'Unauthenticated.' }, { status: 401 });
  }

  const body = await request.text();
  const res = await fetch(`${BACKEND_URL}/user`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body,
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
