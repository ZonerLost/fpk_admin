export function truncateText(text: string, max = 60) {
  const t = (text ?? "").trim();
  if (!t) return "";
  return t.length > max ? `${t.slice(0, max - 1)}…` : t;
}
