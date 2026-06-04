// Lightweight "Excel" export: generates an Excel-compatible .xls (HTML table) file.
// Opens cleanly in Excel / Google Sheets / Numbers.

export function exportToExcel(filename: string, rows: Record<string, any>[]) {
  if (!rows.length) {
    rows = [{ Note: 'No data available' }];
  }
  const headers = Object.keys(rows[0]);
  const esc = (v: any) =>
    String(v ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

  const thead = `<tr>${headers.map((h) => `<th style="background:#2563eb;color:#fff;padding:6px;border:1px solid #ccc">${esc(h)}</th>`).join('')}</tr>`;
  const tbody = rows
    .map(
      (r) =>
        `<tr>${headers.map((h) => `<td style="padding:6px;border:1px solid #ddd">${esc(r[h])}</td>`).join('')}</tr>`
    )
    .join('');

  const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
  <head><meta charset="utf-8"></head>
  <body><table>${thead}${tbody}</table></body></html>`;

  const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.xls') ? filename : `${filename}.xls`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
