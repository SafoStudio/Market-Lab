/**
 * Format a date string or Date object to a readable string
 * @param date - Date string, timestamp, or Date object
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export function formatDate(
  date: string | number | Date,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }
): string {
  if (!date) return 'N/A';

  const dateObj = typeof date === 'string' || typeof date === 'number'
    ? new Date(date)
    : date;

  if (isNaN(dateObj.getTime())) return 'Invalid Date';

  return dateObj.toLocaleDateString('en-US', options);
}

/**
 * Format a date with time
 * @param date - Date string, timestamp, or Date object
 * @returns Formatted date with time (e.g., "Jan 1, 2023, 14:30")
 */
export function formatDateTime(
  date: string | number | Date
): string {
  return formatDate(date, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format a date relative to now (e.g., "2 days ago", "in 1 hour")
 * @param date - Date string, timestamp, or Date object
 * @returns Relative time string
 */
export function formatRelativeTime(
  date: string | number | Date
): string {
  if (!date) return 'N/A';

  const dateObj = typeof date === 'string' || typeof date === 'number'
    ? new Date(date)
    : date;

  if (isNaN(dateObj.getTime())) return 'Invalid Date';

  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  if (Math.abs(diffDays) > 7) {
    return formatDate(date);
  } else if (Math.abs(diffDays) > 0) {
    return rtf.format(-diffDays, 'day');
  } else if (Math.abs(diffHours) > 0) {
    return rtf.format(-diffHours, 'hour');
  } else if (Math.abs(diffMinutes) > 0) {
    return rtf.format(-diffMinutes, 'minute');
  } else {
    return 'Just now';
  }
}

/**
 * Format a date for input fields (YYYY-MM-DD)
 * @param date - Date string, timestamp, or Date object
 * @returns Date in YYYY-MM-DD format
 */
export function formatDateForInput(
  date: string | number | Date
): string {
  if (!date) return '';

  const dateObj = typeof date === 'string' || typeof date === 'number'
    ? new Date(date)
    : date;

  if (isNaN(dateObj.getTime())) return '';

  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

/**
 * Check if a date is today
 * @param date - Date string, timestamp, or Date object
 * @returns boolean
 */
export function isToday(date: string | number | Date): boolean {
  if (!date) return false;

  const dateObj = typeof date === 'string' || typeof date === 'number'
    ? new Date(date)
    : date;

  if (isNaN(dateObj.getTime())) return false;

  const today = new Date();
  return (
    dateObj.getDate() === today.getDate() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getFullYear() === today.getFullYear()
  );
}

/**
 * Format a date difference (e.g., "2d 3h", "1 month")
 * @param startDate - Start date
 * @param endDate - End date (defaults to now)
 * @returns Formatted duration string
 */
export function formatDateDiff(
  startDate: string | number | Date,
  endDate?: string | number | Date
): string {
  if (!startDate) return 'N/A';

  const start = typeof startDate === 'string' || typeof startDate === 'number'
    ? new Date(startDate)
    : startDate;

  if (isNaN(start.getTime())) return 'Invalid Date';

  const end = endDate
    ? (typeof endDate === 'string' || typeof endDate === 'number'
      ? new Date(endDate)
      : endDate)
    : new Date();

  if (isNaN(end.getTime())) return 'Invalid Date';

  const diffMs = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (diffDays > 0) {
    return `${diffDays}d ${diffHours}h`;
  } else if (diffHours > 0) {
    return `${diffHours}h ${diffMinutes}m`;
  } else if (diffMinutes > 0) {
    return `${diffMinutes}m`;
  } else {
    return 'Just now';
  }
}

/**
 * Parse and validate a date string
 * @param dateStr - Date string to parse
 * @returns Valid Date object or null
 */
export function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null;

  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? null : date;
}

/**
 * Check if date is in the past
 * @param date - Date to check
 * @returns boolean
 */
export function isPastDate(date: string | number | Date): boolean {
  if (!date) return false;

  const dateObj = typeof date === 'string' || typeof date === 'number'
    ? new Date(date)
    : date;

  if (isNaN(dateObj.getTime())) return false;

  return dateObj.getTime() < Date.now();
}

/**
 * Check if date is in the future
 * @param date - Date to check
 * @returns boolean
 */
export function isFutureDate(date: string | number | Date): boolean {
  if (!date) return false;

  const dateObj = typeof date === 'string' || typeof date === 'number'
    ? new Date(date)
    : date;

  if (isNaN(dateObj.getTime())) return false;

  return dateObj.getTime() > Date.now();
}