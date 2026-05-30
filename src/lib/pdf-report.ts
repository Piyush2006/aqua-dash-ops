import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export type ReportSection = {
  heading?: string;
  paragraph?: string;
  table?: { head: string[]; body: (string | number)[][] };
};

export function downloadPdfReport(opts: {
  title: string;
  subtitle?: string;
  meta?: Record<string, string>;
  sections?: ReportSection[];
  filename?: string;
}) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 48;

  // Brand header
  doc.setFillColor(15, 76, 129);
  doc.rect(0, 0, pageWidth, 8, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(20, 30, 50);
  doc.text(opts.title, 40, y);
  y += 22;

  if (opts.subtitle) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(90, 100, 120);
    doc.text(opts.subtitle, 40, y);
    y += 18;
  }

  doc.setDrawColor(220, 226, 235);
  doc.line(40, y, pageWidth - 40, y);
  y += 16;

  if (opts.meta && Object.keys(opts.meta).length) {
    doc.setFontSize(10);
    doc.setTextColor(70, 80, 100);
    Object.entries(opts.meta).forEach(([k, v]) => {
      doc.setFont("helvetica", "bold");
      doc.text(`${k}:`, 40, y);
      doc.setFont("helvetica", "normal");
      doc.text(String(v), 130, y);
      y += 14;
    });
    y += 8;
  }

  (opts.sections ?? []).forEach((s) => {
    if (y > 760) { doc.addPage(); y = 48; }
    if (s.heading) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.setTextColor(20, 30, 50);
      doc.text(s.heading, 40, y);
      y += 16;
    }
    if (s.paragraph) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(70, 80, 100);
      const lines = doc.splitTextToSize(s.paragraph, pageWidth - 80);
      doc.text(lines, 40, y);
      y += lines.length * 13 + 6;
    }
    if (s.table) {
      autoTable(doc, {
        head: [s.table.head],
        body: s.table.body.map((r) => r.map((c) => String(c))),
        startY: y,
        styles: { fontSize: 9, cellPadding: 6 },
        headStyles: { fillColor: [15, 76, 129], textColor: 255 },
        alternateRowStyles: { fillColor: [245, 248, 252] },
        margin: { left: 40, right: 40 },
      });
      // @ts-expect-error autotable adds lastAutoTable
      y = (doc.lastAutoTable?.finalY ?? y) + 16;
    }
  });

  // Footer
  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setTextColor(140, 150, 165);
    doc.text(
      `AquaOps · Generated ${new Date().toLocaleString("en-IN")}`,
      40,
      doc.internal.pageSize.getHeight() - 20,
    );
    doc.text(
      `Page ${i} of ${pages}`,
      pageWidth - 40,
      doc.internal.pageSize.getHeight() - 20,
      { align: "right" },
    );
  }

  const safeName = (opts.filename ?? opts.title).replace(/[^a-z0-9-_]+/gi, "_");
  doc.save(`${safeName}.pdf`);
}
