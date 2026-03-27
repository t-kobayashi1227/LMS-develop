import { NextResponse } from 'next/server';
import { BACKEND_URL } from '@/lib/config';
import { getToken } from '@/lib/apiClient';

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ studentId: string }> }
) {
  const { studentId } = await params;
  const token = await getToken();

  if (!token) {
    return NextResponse.json({ message: 'Unauthenticated.' }, { status: 401 });
  }

  const res = await fetch(`${BACKEND_URL}/students/${studentId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
