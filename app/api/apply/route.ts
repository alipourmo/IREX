import { NextResponse } from 'next/server';

const attempts = new Map<string, { count: number; resetAt: number }>();
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const now = Date.now(); const current = attempts.get(ip);
  if (!current || current.resetAt < now) attempts.set(ip, { count: 1, resetAt: now + 60_000 });
  else { current.count += 1; if (current.count > 5) return NextResponse.json({ error: 'Too many requests' }, { status: 429 }); }

  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  if (String(body.website || '').trim()) return NextResponse.json({ ok: true });

  const name = String(body.name || '').trim(); const company = String(body.company || '').trim(); const email = String(body.email || '').trim(); const message = String(body.message || '').trim();
  if (!name || !company || !EMAIL_RE.test(email) || name.length > 120 || company.length > 160 || email.length > 180 || message.length > 3000) return NextResponse.json({ error: 'Invalid fields' }, { status: 400 });

  const apiKey = process.env.RESEND_API_KEY; const to = process.env.APPLICATION_EMAIL || 'alipourmohammadi90@gmail.com'; const from = process.env.RESEND_FROM_EMAIL || 'IREX Applications <onboarding@resend.dev>';
  if (!apiKey) return NextResponse.json({ error: 'Email service is not configured' }, { status: 503 });

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST', headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to: [to], reply_to: email, subject: `IREX Early Adopter — ${company}`, text: `Name: ${name}\nCompany: ${company}\nEmail: ${email}\n\nMessage:\n${message || '—'}` }),
  });
  if (!response.ok) return NextResponse.json({ error: 'Email delivery failed' }, { status: 502 });
  return NextResponse.json({ ok: true });
}
