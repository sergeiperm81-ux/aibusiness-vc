from datetime import date
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

REPORT_LANGUAGE = "English"


def register_unicode_fonts() -> tuple[str, str]:
    candidates = [
        (
            Path("C:/Windows/Fonts/arial.ttf"),
            Path("C:/Windows/Fonts/arialbd.ttf"),
            "ArialUnicode",
            "ArialUnicode-Bold",
        ),
        (
            Path("C:/Windows/Fonts/segoeui.ttf"),
            Path("C:/Windows/Fonts/segoeuib.ttf"),
            "SegoeUnicode",
            "SegoeUnicode-Bold",
        ),
    ]

    for regular_path, bold_path, regular_name, bold_name in candidates:
        if regular_path.exists() and bold_path.exists():
            pdfmetrics.registerFont(TTFont(regular_name, str(regular_path)))
            pdfmetrics.registerFont(TTFont(bold_name, str(bold_path)))
            return regular_name, bold_name

    return "Helvetica", "Helvetica-Bold"


def build_pdf(output_path: Path) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    regular_font, bold_font = register_unicode_fonts()

    doc = SimpleDocTemplate(
        str(output_path),
        pagesize=A4,
        rightMargin=16 * mm,
        leftMargin=16 * mm,
        topMargin=14 * mm,
        bottomMargin=14 * mm,
        title="Super.tennis - AI Visibility Executive Action Brief",
        author="AI Business",
    )

    styles = getSampleStyleSheet()
    h1 = ParagraphStyle(
        "H1",
        parent=styles["Heading1"],
        fontName=bold_font,
        fontSize=22,
        leading=26,
        textColor=colors.HexColor("#111111"),
        spaceAfter=6,
    )
    sub = ParagraphStyle(
        "Sub",
        parent=styles["Normal"],
        fontName=regular_font,
        fontSize=9,
        leading=13,
        textColor=colors.HexColor("#5D6672"),
        spaceAfter=8,
    )
    h2 = ParagraphStyle(
        "H2",
        parent=styles["Heading2"],
        fontName=bold_font,
        fontSize=13,
        leading=16,
        textColor=colors.HexColor("#111111"),
        spaceBefore=8,
        spaceAfter=5,
    )
    body = ParagraphStyle(
        "Body",
        parent=styles["Normal"],
        fontName=regular_font,
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#1C2430"),
        spaceAfter=5,
    )

    story = []
    today = date.today().isoformat()

    story.append(Paragraph("Super.tennis - AI Visibility Action Brief", h1))
    story.append(
        Paragraph(
            f"For leadership | Language: {REPORT_LANGUAGE} | Date: {today} | Package: Standard (EUR 149)",
            sub,
        )
    )

    hero = Table(
        [
            ["Current score", "90/100"],
            ["Critical blockers", "0"],
            ["Primary upside", "Schema + citation formatting"],
        ],
        colWidths=[70 * mm, 104 * mm],
    )
    hero.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#0F1115")),
                ("TEXTCOLOR", (0, 0), (-1, -1), colors.white),
                ("GRID", (0, 0), (-1, -1), 0.35, colors.HexColor("#E3A500")),
                ("FONTNAME", (0, 0), (0, -1), bold_font),
                ("FONTNAME", (1, 0), (1, -1), regular_font),
                ("FONTSIZE", (0, 0), (-1, -1), 10),
                ("LEFTPADDING", (0, 0), (-1, -1), 8),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )
    story.append(hero)
    story.append(Spacer(1, 6))

    story.append(Paragraph("Executive takeaway", h2))
    story.append(
        Paragraph(
            "The site is already in a strong position. This is not a rescue project. "
            "It is a quality-optimization project focused on increasing AI citation probability.",
            body,
        )
    )

    story.append(Paragraph("Realistic implementation cadence", h2))
    rollout = Table(
        [
            ["Session", "Duration", "Focus", "Outcome"],
            ["1", "90-120 min", "Schema patches + llms.txt refresh", "Higher machine readability"],
            ["2", "90-150 min", "FAQ + comparison blocks on priority pages", "Higher citation readiness"],
            ["3 (optional)", "60-90 min", "Internal links + QA pass", "Stable and repeatable quality"],
        ],
        colWidths=[18 * mm, 28 * mm, 76 * mm, 52 * mm],
    )
    rollout.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#FFE7A3")),
                ("FONTNAME", (0, 0), (-1, 0), bold_font),
                ("GRID", (0, 0), (-1, -1), 0.35, colors.HexColor("#D6B662")),
                ("FONTSIZE", (0, 0), (-1, -1), 9),
                ("BACKGROUND", (0, 1), (-1, -1), colors.HexColor("#FFFDF7")),
            ]
        )
    )
    story.append(rollout)

    story.append(Paragraph("What the owner should do", h2))
    story.append(
        Paragraph(
            "1) Approve the execution priority (schema first, then citation blocks).<br/>"
            "2) Assign one operator/manager to run the Ops Pack with AI support.<br/>"
            "3) Request a post-implementation re-scan and before/after delta summary.",
            body,
        )
    )

    story.append(Paragraph("What the team should do", h2))
    story.append(
        Paragraph(
            "Execute P1 items from the implementation backlog first. "
            "Target completion in 1-3 focused working sessions.",
            body,
        )
    )

    story.append(Paragraph("What to feed your AI (in order)", h2))
    ai_order = Table(
        [
            ["Step", "File", "Instruction for AI"],
            ["1", "schema-patches.json", "Apply template patches and return a clean diff."],
            ["2", "llms.txt.draft", "Update llms.txt and verify top URLs/descriptions."],
            ["3", "ai-builder-pack-prompts.md", "Run Prompt 2, then 3, then 4."],
            ["4", "implementation-backlog-super-tennis.csv", "Mark completed tasks and unresolved blockers."],
            ["5", "standard-report-super-tennis-2026-04-28.md", "Run final QA against top findings."],
        ],
        colWidths=[12 * mm, 74 * mm, 88 * mm],
    )
    ai_order.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#111111")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("FONTNAME", (0, 0), (-1, 0), bold_font),
                ("GRID", (0, 0), (-1, -1), 0.35, colors.HexColor("#D7DCE5")),
                ("FONTSIZE", (0, 0), (-1, -1), 8.8),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#F8F9FC")]),
            ]
        )
    )
    story.append(ai_order)

    story.append(Paragraph("Delivered files", h2))
    story.append(
        Paragraph(
            "- Executive PDF (this file)<br/>"
            "- Ops Pack (zip) for managers and implementers<br/>"
            "- Client package (zip) for delivery",
            body,
        )
    )

    story.append(Paragraph("Expected result", h2))
    story.append(
        Paragraph(
            "With clean execution, expected range is 93-97 overall, with stronger AI citation frequency on commercial-intent pages.",
            body,
        )
    )

    story.append(Spacer(1, 8))
    story.append(
        Paragraph(
            "AI Business | Executive Action PDF",
            ParagraphStyle(
                "F",
                parent=sub,
                fontName=regular_font,
                fontSize=8,
                textColor=colors.HexColor("#7A808A"),
                spaceAfter=0,
            ),
        )
    )

    doc.build(story)


if __name__ == "__main__":
    out = Path("deliverables/super-tennis/client/SuperTennis-Executive-Brief.pdf")
    build_pdf(out)
    print(f"Generated: {out}")
