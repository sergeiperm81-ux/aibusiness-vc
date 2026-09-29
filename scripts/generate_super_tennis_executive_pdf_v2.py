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


def card_table(title: str, value: str, subtitle: str):
    data = [[title], [value], [subtitle]]
    t = Table(data, colWidths=[56 * mm])
    t.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#0F1115")),
                ("BOX", (0, 0), (-1, -1), 1.2, colors.HexColor("#E3A500")),
                ("TOPPADDING", (0, 0), (-1, -1), 7),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
                ("LEFTPADDING", (0, 0), (-1, -1), 8),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("FONTSIZE", (0, 0), (-1, 0), 8),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.HexColor("#E3A500")),
                ("FONTNAME", (0, 1), (-1, 1), "Helvetica-Bold"),
                ("FONTSIZE", (0, 1), (-1, 1), 24),
                ("TEXTCOLOR", (0, 1), (-1, 1), colors.white),
                ("FONTNAME", (0, 2), (-1, 2), "Helvetica"),
                ("FONTSIZE", (0, 2), (-1, 2), 8),
                ("TEXTCOLOR", (0, 2), (-1, 2), colors.HexColor("#B8BDC6")),
            ]
        )
    )
    return t


def build_pdf(output_path: Path) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)

    doc = SimpleDocTemplate(
        str(output_path),
        pagesize=A4,
        rightMargin=16 * mm,
        leftMargin=16 * mm,
        topMargin=14 * mm,
        bottomMargin=14 * mm,
        title="Super.tennis - Executive AI Visibility Report",
        author="AI Business",
    )

    styles = getSampleStyleSheet()
    h1 = ParagraphStyle(
        "H1",
        parent=styles["Heading1"],
        fontName="Helvetica-Bold",
        fontSize=24,
        leading=28,
        textColor=colors.HexColor("#111111"),
        spaceAfter=6,
    )
    sub = ParagraphStyle(
        "Sub",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#58606B"),
        spaceAfter=8,
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
        textColor=colors.HexColor("#1D2430"),
        spaceAfter=6,
    )

    story = []
    today = date.today().isoformat()

    # Cover
    story.append(Paragraph("Executive AI Visibility Report", h1))
    story.append(Paragraph("Super.tennis", ParagraphStyle("Dom", parent=h1, fontSize=30, leading=34)))
    story.append(
        Paragraph(
            f"Prepared for leadership | Standard package | {today}",
            sub,
        )
    )
    story.append(Spacer(1, 3))

    cards = Table(
        [
            [
                card_table("OVERALL SCORE", "90/100", "Strong baseline"),
                card_table("BIGGEST UPSIDE", "Schema", "65 -> 85+ target"),
                card_table("PRIORITY", "Quality", "Citation expansion"),
            ]
        ],
        colWidths=[58 * mm, 58 * mm, 58 * mm],
    )
    cards.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP")]))
    story.append(cards)
    story.append(Spacer(1, 10))

    story.append(Paragraph("What this means for the business", h2))
    story.append(
        Paragraph(
            "The site is not in danger. It is already technically healthy for AI discovery. "
            "The growth lever now is execution quality: deeper structure, more citable page modules, "
            "and better internal entity linking across high-intent clusters.",
            body,
        )
    )

    story.append(Paragraph("Where value comes from", h2))
    story.append(
        Paragraph(
            "This is an optimization phase. Improvements are expected from raising citation frequency, "
            "not from fixing critical outages. The package is designed to accelerate implementation with "
            "ready artifacts and manager-ready backlog.",
            body,
        )
    )

    story.append(Paragraph("Signal breakdown", h2))
    table = Table(
        [
            ["Signal", "Score", "Status"],
            ["llms.txt", "100", "Strong"],
            ["Schema markup", "65", "Primary improvement area"],
            ["AI crawler access", "100", "Strong"],
            ["Citation readiness", "86", "Strong, improve depth"],
            ["Page speed", "92", "Strong"],
            ["Mobile friendliness", "95", "Strong"],
            ["HTTPS & security", "100", "Strong"],
            ["Content structure", "78", "Improve extractability"],
        ],
        colWidths=[72 * mm, 24 * mm, 84 * mm],
    )
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#111111")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("FONTSIZE", (0, 0), (-1, -1), 9),
                ("GRID", (0, 0), (-1, -1), 0.35, colors.HexColor("#D9DEE7")),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#F7F8FA")]),
            ]
        )
    )
    story.append(table)

    story.append(Paragraph("30-day rollout", h2))
    rollout = Table(
        [
            ["Week", "Focus", "Output"],
            ["1", "Schema deployment", "Template-level JSON-LD stack live"],
            ["2", "Citation blocks", "FAQ and comparison modules on top pages"],
            ["3", "Internal graph", "Hub-spoke links across key clusters"],
            ["4", "Validation", "Re-crawl delta report and next sprint plan"],
        ],
        colWidths=[18 * mm, 52 * mm, 110 * mm],
    )
    rollout.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#FFE7A3")),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("GRID", (0, 0), (-1, -1), 0.35, colors.HexColor("#D4B158")),
                ("FONTSIZE", (0, 0), (-1, -1), 9),
                ("BACKGROUND", (0, 1), (-1, -1), colors.HexColor("#FFFDF6")),
            ]
        )
    )
    story.append(rollout)

    story.append(Paragraph("Expected outcome", h2))
    story.append(
        Paragraph(
            "If implementation is executed cleanly, the expected overall range is "
            "<b>93-97</b>, with stronger AI citation probability on commercial-intent tennis queries.",
            body,
        )
    )

    story.append(Paragraph("Decision required", h2))
    story.append(
        Paragraph(
            "Approve the implementation backlog and assign owners (Engineering, SEO, Editorial, QA). "
            "Execution artifacts are included in the operations package.",
            body,
        )
    )

    story.append(Spacer(1, 10))
    story.append(
        Paragraph(
            "Prepared by AI Business | Executive version",
            ParagraphStyle(
                "Footer",
                parent=sub,
                fontSize=8,
                textColor=colors.HexColor("#7B818B"),
                spaceAfter=0,
            ),
        )
    )

    doc.build(story)


if __name__ == "__main__":
    out = Path("deliverables/super-tennis/client/SuperTennis-Executive-Report-v2.pdf")
    build_pdf(out)
    print(f"Generated: {out}")
