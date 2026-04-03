import { NextResponse } from 'next/server';
import { BACKEND_URL } from '@/lib/config';
import { getToken } from '@/lib/apiClient';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ assignmentId: string }> }
) {
  const { assignmentId } = await params;
  const token = await getToken();

  if (!token) {
    return NextResponse.json({ message: 'Unauthenticated.' }, { status: 401 });
  }

  const contentType = request.headers.get('content-type') || '';
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/json',
  };

  let body: BodyInit;
  if (contentType.includes('multipart/form-data')) {
    headers['Content-Type'] = contentType;
    body = await request.arrayBuffer();
  } else {
    headers['Content-Type'] = 'application/json';
    body = await request.text();
  }

  const res = await fetch(`${BACKEND_URL}/assignments/${assignmentId}/submit`, {
    method: 'POST',
    headers,
    body,
  });

  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
