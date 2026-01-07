/**
 * Converts 12-hour format (with AM/PM) to 24-hour format
 * @param hour - Hour in 12-hour format (1-12)
 * @param minute - Minute (0-59)
 * @param period - AM or PM
 * @returns Time string in 24-hour format (HH:mm:ss)
 */
export function convertTo24HourFormat(
  hour: string,
  minute: string,
  period: "AM" | "PM"
): string {
  const hourNum = Number.parseInt(hour, 10);
  let hour24: number;

  if (period === "AM") {
    // AM period: 12 → 00, 1-11 → keep as is
    hour24 = hourNum === 12 ? 0 : hourNum;
  } else {
    // PM period: 12 → 12, 1-11 → add 12
    hour24 = hourNum === 12 ? 12 : hourNum + 12;
  }

  // Pad hour and minute to 2 digits
  const hour24Str = hour24.toString().padStart(2, "0");
  const minuteStr = minute.padStart(2, "0");

  return `${hour24Str}:${minuteStr}:00`;
}
