import { translations } from './index';
import type { SupportedLanguage } from './rtl';
import { bidiIsolate } from '@/utils/bidi';

type MonthKey = keyof (typeof translations)['ur']['months'];

function monthName(language: SupportedLanguage, month: string): string | null {
  const key = `m${month}` as MonthKey;
  return translations[language].months[key] ?? null;
}

/** "2026-10" -> "October 2026" (localised month name, LTR-isolated year). */
export function formatBillingMonth(language: SupportedLanguage, billingMonth: string): string {
  const match = /^(\d{4})-(0[1-9]|1[0-2])$/.exec(billingMonth);
  const year = match?.[1];
  const month = match?.[2];
  if (!year || !month) return billingMonth;
  const name = monthName(language, month);
  return name ? `${name} ${bidiIsolate(year)}` : billingMonth;
}

/** "2026-11-18" -> "18 November 2026" (localised month name, LTR-isolated numbers). */
export function formatDate(language: SupportedLanguage, isoDate: string): string {
  const match = /^(\d{4})-(0[1-9]|1[0-2])-(\d{2})$/.exec(isoDate);
  const year = match?.[1];
  const month = match?.[2];
  const day = match?.[3];
  if (!year || !month || !day) return isoDate;
  const name = monthName(language, month);
  return name ? `${bidiIsolate(Number(day))} ${name} ${bidiIsolate(year)}` : isoDate;
}
