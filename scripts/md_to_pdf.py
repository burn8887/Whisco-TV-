#!/usr/bin/env python3
"""Render a markdown file to a clean A4 PDF for use as a store-review attachment.

Built for the rights pack: it handles the subset of markdown that document actually
uses — headings, paragraphs, bold/italic/inline code, bullets, numbered lists, rules
and pipe tables. No external services, no browser, no Word.

Usage:
    pip install reportlab
    python3 scripts/md_to_pdf.py docs/business/RIGHTS_PACK_build6.md docs/business/RIGHTS_PACK_build6.pdf
"""
import re
import sys

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (HRFlowable, KeepTogether, ListFlowable, ListItem,
                                PageBreak, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle)

INK = colors.HexColor("#111111")
MUTED = colors.HexColor("#555555")
RULE = colors.HexColor("#c8c8c8")
SHADE = colors.HexColor("#f1f1f1")


def inline(text: str) -> str:
    """Markdown inline markup -> reportlab tags."""
    text = text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    text = re.sub(r"`([^`]+)`", r'<font face="Courier" size="8">\1</font>', text)
    text = re.sub(r"\*\*([^*]+)\*\*", r"<b>\1</b>", text)
    text = re.sub(r"(?<!\*)\*([^*]+)\*(?!\*)", r"<i>\1</i>", text)
    text = text.replace("&amp;lt;", "&lt;").replace("&amp;gt;", "&gt;")
    return text


def styles():
    ss = getSampleStyleSheet()
    return {
        "h1": ParagraphStyle("h1", parent=ss["Title"], fontName="Helvetica-Bold", fontSize=17,
                             leading=21, spaceAfter=2, textColor=INK, alignment=TA_LEFT),
        "h2": ParagraphStyle("h2", parent=ss["Heading2"], fontName="Helvetica-Bold", fontSize=11.5,
                             leading=14, spaceBefore=11, spaceAfter=4, textColor=INK),
        "h3": ParagraphStyle("h3", parent=ss["Heading3"], fontName="Helvetica-Bold", fontSize=10,
                             leading=13, spaceBefore=8, spaceAfter=3, textColor=INK),
        "body": ParagraphStyle("body", parent=ss["BodyText"], fontName="Helvetica", fontSize=9,
                               leading=12.4, spaceAfter=5, textColor=INK),
        "li": ParagraphStyle("li", parent=ss["BodyText"], fontName="Helvetica", fontSize=9,
                             leading=12.2, textColor=INK),
        "cell": ParagraphStyle("cell", parent=ss["BodyText"], fontName="Helvetica", fontSize=7.6,
                               leading=9.6, textColor=INK),
        "cellh": ParagraphStyle("cellh", parent=ss["BodyText"], fontName="Helvetica-Bold", fontSize=7.6,
                                leading=9.6, textColor=INK),
        "foot": ParagraphStyle("foot", parent=ss["BodyText"], fontName="Helvetica", fontSize=7.4,
                               leading=9, textColor=MUTED),
    }


def make_table(rows, st, avail):
    """rows: list of list of raw markdown cell text; first row is the header."""
    header, *body = rows
    ncols = max(len(r) for r in rows)
    weights = []
    for i in range(ncols):
        longest = max((len(r[i]) if i < len(r) else 0) for r in rows)
        weights.append(min(max(longest, 8), 46))
    total = sum(weights)
    widths = [avail * w / total for w in weights]
    data = [[Paragraph(inline(c) if i < len(r) else "", st["cellh"] if r is header else st["cell"])
             for i, c in enumerate(r + [""] * (ncols - len(r)))] for r in rows]
    t = Table(data, colWidths=widths, repeatRows=1, hAlign="LEFT")
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), SHADE),
        ("GRID", (0, 0), (-1, -1), 0.4, RULE),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 4),
        ("RIGHTPADDING", (0, 0), (-1, -1), 4),
        ("TOPPADDING", (0, 0), (-1, -1), 3),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
    ]))
    return t


def parse(md: str, st, avail):
    """Markdown -> flowables."""
    out, i = [], 0
    lines = md.split("\n")
    while i < len(lines):
        line = lines[i]
        s = line.strip()

        if not s:
            i += 1
            continue

        if s.startswith("|") and not set(s) <= set("|-: "):
            rows = []
            while i < len(lines) and lines[i].strip().startswith("|"):
                raw = lines[i].strip()
                if not set(raw) <= set("|-: "):  # skip the |---|---| separator
                    rows.append([c.strip() for c in raw.strip("|").split("|")])
                i += 1
            out.append(Spacer(1, 2))
            out.append(make_table(rows, st, avail))
            out.append(Spacer(1, 6))
            continue

        if s.startswith("# "):
            out += [Paragraph(inline(s[2:]), st["h1"]), HRFlowable(width="100%", thickness=1.1,
                                                                   color=INK, spaceAfter=7)]
        elif s.startswith("## "):
            out.append(Paragraph(inline(s[3:]), st["h2"]))
        elif s.startswith("### "):
            out.append(Paragraph(inline(s[4:]), st["h3"]))
        elif set(s) <= set("-—–*_ ") and len(s) >= 3:
            out += [Spacer(1, 5), HRFlowable(width="100%", thickness=0.5, color=RULE), Spacer(1, 6)]
        elif re.match(r"^[-*] ", s):
            items = []
            while i < len(lines) and re.match(r"^[-*] ", lines[i].strip()):
                items.append(ListItem(Paragraph(inline(lines[i].strip()[2:]), st["li"]),
                                      leftIndent=11, value=None))
                i += 1
            out += [ListFlowable(items, bulletType="bullet", bulletFontSize=6, leftIndent=11,
                                 bulletOffsetY=-1, spaceAfter=6)]
            continue
        elif re.match(r"^\d+\. ", s):
            items = []
            while i < len(lines) and re.match(r"^\d+\. ", lines[i].strip()):
                items.append(ListItem(Paragraph(inline(re.sub(r"^\d+\. ", "", lines[i].strip())), st["li"]),
                                      leftIndent=15))
                i += 1
            out += [ListFlowable(items, bulletType="1", leftIndent=15, bulletFontSize=8, spaceAfter=6)]
            continue
        else:
            para = [s]
            i += 1
            while i < len(lines) and lines[i].strip() and not re.match(
                    r"^(#|\||[-*] |\d+\. |---+$)", lines[i].strip()):
                para.append(lines[i].strip())
                i += 1
            out.append(Paragraph(inline(" ".join(para)), st["body"]))
            continue
        i += 1
    return out


def main():
    src, dst = sys.argv[1], sys.argv[2]
    title = None
    md = open(src, encoding="utf-8").read()
    m = re.search(r"^#\s+(.+)$", md, re.M)
    if m:
        title = re.sub(r"[*`]", "", m.group(1)).strip()

    st = styles()
    doc = SimpleDocTemplate(dst, pagesize=A4, leftMargin=17 * mm, rightMargin=17 * mm,
                            topMargin=15 * mm, bottomMargin=15 * mm,
                            title=title or "Document", author="Whisco TV",
                            subject=title or "", creator="Whisco TV")
    avail = doc.width

    def footer(canvas, d):
        canvas.saveState()
        canvas.setFont("Helvetica", 7.4)
        canvas.setFillColor(MUTED)
        canvas.drawString(doc.leftMargin, 9 * mm, title or "")
        canvas.drawRightString(A4[0] - doc.rightMargin, 9 * mm, f"Page {d.page}")
        canvas.setStrokeColor(RULE)
        canvas.setLineWidth(0.4)
        canvas.line(doc.leftMargin, 11.5 * mm, A4[0] - doc.rightMargin, 11.5 * mm)
        canvas.restoreState()

    doc.build(parse(md, st, avail), onFirstPage=footer, onLaterPages=footer)
    print(f"  wrote {dst}")


if __name__ == "__main__":
    main()
