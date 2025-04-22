/*
 * Copyright (c) 2025, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

/**
 * Generates columns for a table
 *
 * @param keys - Array of keys for column headers
 * @returns Object of column configurations
 */
export function generateTableColumns(keys: string[]): Record<string, { header: string }> {
  return keys.reduce<Record<string, { header: string }>>((result, key) => {
    const newResult = { ...result };
    newResult[key] = { header: key.charAt(0).toUpperCase() + key.slice(1) };
    return newResult;
  }, {});
}

/**
 * Format data as a pretty ASCII table
 *
 * @param data - Array of data objects
 * @param columns - Object containing column definitions
 * @returns Formatted table string
 */
export function formatAsTable<T extends Record<string, unknown>>(
  data: T[],
  columns: Array<{ key: keyof T; label: string; width?: number }>
): string[] {
  if (data.length === 0) {
    return ['No data to display'];
  }

  const columnWidths = columns.map((col) => {
    const headerLength = col.label.length;
    const maxDataLength = Math.max(
      ...data.map((item) => {
        const value = item[col.key] ?? '';
        return String(value).length;
      })
    );
    return col.width ?? Math.max(headerLength, maxDataLength, 10);
  });

  const headerRow = columns.map((col, i) => col.label.padEnd(columnWidths[i])).join(' | ');

  const separatorRow = columns.map((_, i) => '-'.repeat(columnWidths[i])).join('-+-');

  const dataRows = data.map((item) =>
    columns
      .map((col, i) => {
        const value = item[col.key] ?? '';
        return String(value).padEnd(columnWidths[i]);
      })
      .join(' | ')
  );

  return [headerRow, separatorRow, ...dataRows];
}
