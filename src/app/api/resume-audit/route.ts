import { NextResponse } from "next/server";
import { runResumeAudit } from "@/lib/resume-audit";

export const runtime = "nodejs";
export const maxDuration = 20;

interface ResumeAuditRequest {
  resumeText: string;
  targetRole: string;
  targetJobDescription?: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ResumeAuditRequest;
    const resumeText = (body.resumeText ?? "").trim();
    const targetRole = (body.targetRole ?? "").trim();
    const targetJobDescription = (body.targetJobDescription ?? "").trim();

    if (!resumeText || resumeText.length < 120) {
      return NextResponse.json(
        { ok: false, error: "Resume text is too short. Paste at least 120 characters." },
        { status: 400 }
      );
    }

    if (!targetRole) {
      return NextResponse.json(
        { ok: false, error: "Target role is required." },
        { status: 400 }
      );
    }

    const result = runResumeAudit({
      resumeText,
      targetRole,
      targetJobDescription: targetJobDescription || undefined,
    });

    return NextResponse.json({
      ok: true,
      result,
    });
  } catch (error) {
    console.error("Resume audit error:", error);
    return NextResponse.json({ ok: false, error: "Failed to audit resume." }, { status: 500 });
  }
}
