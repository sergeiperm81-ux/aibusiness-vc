import { NextResponse } from "next/server";
import { incrBy, readCount } from "@/lib/redis";

/**
 * Reader votes on Partner Stories: "would you try this product?", 0 to 10.
 *
 * Two permanent counters per story, sum and count, so the average is exact and
 * cheap. One vote per reader is enforced client-side via localStorage — good
 * enough for a sentiment widget, and the strict alternative (fingerprinting
 * readers) would cost more privacy than the number is worth.
 */

const SLUG_RE = /^[a-z0-9-]{3,80}$/;

function keys(slug: string) {
  return { sum: `vote:sum:${slug}`, count: `vote:count:${slug}` };
}

async function readStats(slug: string) {
  const k = keys(slug);
  const [sum, count] = await Promise.all([readCount(k.sum), readCount(k.count)]);
  if (sum === null || count === null) return null;
  return {
    count,
    average: count > 0 ? Math.round((sum / count) * 10) / 10 : null,
  };
}

export async function GET(request: Request) {
  const slug = new URL(request.url).searchParams.get("slug") ?? "";
  if (!SLUG_RE.test(slug)) {
    return NextResponse.json({ ok: false, error: "Bad slug." }, { status: 400 });
  }
  const stats = await readStats(slug);
  if (!stats) {
    return NextResponse.json({ ok: false, error: "Votes are unavailable right now." }, { status: 503 });
  }
  return NextResponse.json({ ok: true, ...stats });
}

export async function POST(request: Request) {
  let body: { slug?: string; score?: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request." }, { status: 400 });
  }

  const slug = String(body.slug ?? "");
  const score = Number(body.score);
  if (!SLUG_RE.test(slug) || !Number.isInteger(score) || score < 0 || score > 10) {
    return NextResponse.json({ ok: false, error: "Bad vote." }, { status: 400 });
  }

  const k = keys(slug);
  const count = await incrBy(k.count, 1);
  if (count === null) {
    return NextResponse.json({ ok: false, error: "Votes are unavailable right now." }, { status: 503 });
  }
  await incrBy(k.sum, score);

  const stats = await readStats(slug);
  return NextResponse.json({ ok: true, ...(stats ?? { count, average: null }) });
}
