/*
 * Copyright 2026, Salesforce, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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
