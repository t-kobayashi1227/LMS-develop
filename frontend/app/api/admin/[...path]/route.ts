import { NextResponse } from 'next/server';
import { BACKEND_URL } from '@/lib/config';
import { getToken } from '@/lib/apiClient';

async function proxyRequest(request: Request, params: Promise<{ path: string[] }>) {
  const { path } = await params;
  const token = await getToken();

  if (!token) {
    return NextResponse.json({ message: 'Unauthenticated.' }, { status: 401 });
  }

  const backendPath = `/admin/${path.join('/')}`;
  const url = `${BACKEND_URL}${backendPath}`;

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/json',
  };

  const init: RequestInit = { method: request.method, headers };

  if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
    headers['Content-Type'] = 'application/json';
    init.body = await request.text();
  }

  const res = await fetch(url, init);
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}

export async function GET(req: Request, ctx: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(req, ctx.params);
}
export async function POST(req: Request, ctx: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(req, ctx.params);
}
export async function PUT(req: Request, ctx: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(req, ctx.params);
}
export async function DELETE(req: Request, ctx: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(req, ctx.params);
}
