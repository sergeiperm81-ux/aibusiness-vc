from datetime import date
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


def build_pdf(output_path: Path) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)

    doc = SimpleDocTemplate(
        str(output_path),
        pagesize=A4,
        rightMargin=18 * mm,
        leftMargin=18 * mm,
        topMargin=16 * mm,
        bottomMargin=16 * mm,
        title="Super.tennis - AI Visibility Executive Report",
        author="AI Business",
    )

    styles = getSampleStyleSheet()
    title = ParagraphStyle(
        "Title",
        parent=styles["Heading1"],
        fontName="Helvetica-Bold",
        fontSize=22,
        leading=26,
        textColor=colors.HexColor("#111111"),
        spaceAfter=8,
    )
    subtitle = ParagraphStyle(
        "Subtitle",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#555555"),
        spaceAfter=10,
    )
    h2 = ParagraphStyle(
        "H2",
        parent=styles["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=13,
        leading=16,
        textColor=colors.HexColor("#111111"),
        spaceBefore=10,
        spaceAfter=6,
    )
    body = ParagraphStyle(
        "Body",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#222222"),
        spaceAfter=6,
    )

    story = []
    today = date.today().isoformat()

    story.append(Paragraph("Super.tennis AI Visibility Executive Report", title))
    story.append(
        Paragraph(
            f"Prepared for leadership | Domain: super.tennis | Date: {today} | Package: Standard (EUR 149)",
            subtitle,
        )
    )

    story.append(Paragraph("Leadership takeaway", h2))
    story.append(
        Paragraph(
            "<b>Current position is strong (90/100)</b>, with no critical blockers. "
            "Main upside is now quality optimization: deeper schema coverage, stronger citation formatting, "
            "and tighter internal entity linking. This is an optimization project, not a rescue project.",
            body,
        )
    )

    story.append(Paragraph("Score snapshot", h2))
    score_table = Table(
        [
            ["Signal", "Score", "Interpretation"],
            ["llms.txt", "100", "Strong"],
            ["Schema markup", "65", "Largest upside area"],
            ["AI crawlers access", "100", "Strong"],
            ["Citation readiness", "86", "Strong with room to improve"],
            ["Page speed", "92", "Strong"],
            ["Mobile friendliness", "95", "Strong"],
            ["HTTPS & security", "100", "Strong"],
            ["Content structure", "78", "Improve extractability"],
            ["Overall", "90", "Above baseline (68)"],
        ],
        colWidths=[62 * mm, 20 * mm, 84 * mm],
    )
    score_table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#111111")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("FONTSIZE", (0, 0), (-1, -1), 9),
                ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#D5D5D5")),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#F7F7F7")]),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ]
        )
    )
    story.append(score_table)
    story.append(Spacer(1, 4))

    story.append(Paragraph("What we do next (30-day plan)", h2))
    story.append(
        Paragraph(
            "<b>Week 1:</b> expand template-level schema stack; deploy FAQ schema where appropriate.<br/>"
            "<b>Week 2:</b> add comparison tables and summary blocks on high-intent pages.<br/>"
            "<b>Week 3:</b> strengthen hub-and-spoke internal links across gear, players, tournaments.<br/>"
            "<b>Week 4:</b> re-crawl and produce before/after delta report.",
            body,
        )
    )

    story.append(Paragraph("Expected outcome", h2))
    story.append(
        Paragraph(
            "If rollout is executed cleanly, expected range is <b>93-97 overall</b>, with improved citation "
            "frequency in AI answer surfaces for commercial tennis queries.",
            body,
        )
    )

    story.append(Paragraph("Decision request", h2))
    story.append(
        Paragraph(
            "Approve implementation backlog and assign owners for Schema, Content, SEO, and QA. "
            "Execution artifacts are packaged separately for managers and AI-assisted delivery.",
            body,
        )
    )

    story.append(Spacer(1, 10))
    story.append(
        Paragraph(
            "Prepared by AI Business | Executive version (client-safe)",
            ParagraphStyle(
                "Foot",
                parent=subtitle,
                fontSize=8,
                textColor=colors.HexColor("#777777"),
                spaceAfter=0,
            ),
        )
    )

    doc.build(story)


if __name__ == "__main__":
    out = Path("deliverables/super-tennis/client/SuperTennis-Executive-Report.pdf")
    build_pdf(out)
    print(f"Generated: {out}")
