const KAZAKH_MONTHS = [
  "қаңтар",
  "ақпан",
  "наурыз",
  "сәуір",
  "мамыр",
  "маусым",
  "шілде",
  "тамыз",
  "қыркүйек",
  "қазан",
  "қараша",
  "желтоқсан",
];

/** Formats an ISO timestamp as "18 қыркүйек 2026" without relying on ICU locale data. */
export function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return `${date.getDate()} ${KAZAKH_MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}
