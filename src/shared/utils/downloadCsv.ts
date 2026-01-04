// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function downloadCsv(filename: string, rows: Array<Record<string, any>>) {
  if (!rows?.length) return;

  const headers = Object.keys(rows[0]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const escape = (val: any) => {
    const s = String(val ?? "");
    if (s.includes(",") || s.includes('"') || s.includes("\n")) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  };

  const csv = [headers.join(","), ...rows.map((r) => headers.map((h) => escape(r[h])).join(","))].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
