import type { StoredBill } from '@/services/storage/billRecord';

export const EXPORT_FORMAT_VERSION = 1;

/**
 * Builds the user-initiated export. The result contains UNENCRYPTED personal data, so the UI
 * must show the export warning before this is shared or saved anywhere.
 */
export function buildExportJson(bills: readonly StoredBill[], exportedAt: Date): string {
  return JSON.stringify(
    {
      app: 'bijli-dost',
      formatVersion: EXPORT_FORMAT_VERSION,
      exportedAt: exportedAt.toISOString(),
      bills,
    },
    null,
    2
  );
}
