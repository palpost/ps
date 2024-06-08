import { NextResponse } from 'next/server';

export const runtime = 'edge';
export async function GET() {
  const res = await fetch(
    'https://ipgeolocation.abstractapi.com/v1/?api_key=afc510081d1743259f780ff97bdd2b93',
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  const userinfo = await res.json();
  return NextResponse.json(userinfo, { status: 200 });
}
