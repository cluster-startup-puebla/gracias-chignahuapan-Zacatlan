import {NextRequest, NextResponse} from 'next/server';
import {recordScan, recordEmail} from '@/data/scans';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const {slug} = body;
  if (!slug) {
    return NextResponse.json({error: 'slug required'}, {status: 400});
  }
  const ip = request.headers.get('x-forwarded-for') || undefined;
  recordScan(slug, ip);
  return NextResponse.json({ok: true});
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const {email, slug} = body;
  if (!email || !slug) {
    return NextResponse.json({error: 'email and slug required'}, {status: 400});
  }
  recordEmail(email, slug);
  return NextResponse.json({ok: true});
}
