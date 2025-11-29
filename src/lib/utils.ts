export function formatNumber(n: number) {
  return new Intl.NumberFormat("en-US").format(n);
}

export function formatDateDiff(date: Date) {
  const now = new Date();
  // Intl.RelativeTimeFormat expects a negative value for past dates
  const diffInSeconds = (date.getTime() - now.getTime()) / 1000;

  // Threshold in seconds below which we'll just say "just now"
  const justNowThreshold = -5;
  if (diffInSeconds > justNowThreshold) {
    return "just now";
  }

  const units: { unit: Intl.RelativeTimeFormatUnit; seconds: number }[] = [
    { unit: "week", seconds: 604800 },
    { unit: "day", seconds: 86400 },
    { unit: "hour", seconds: 3600 },
    { unit: "minute", seconds: 60 },
  ];

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  for (const { unit, seconds } of units) {
    if (Math.abs(diffInSeconds) >= seconds) {
      return rtf.format(Math.round(diffInSeconds / seconds), unit);
    }
  }

  return rtf.format(Math.round(diffInSeconds), "second");
}
