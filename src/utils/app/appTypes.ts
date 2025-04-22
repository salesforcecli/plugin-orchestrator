/*
 * Copyright (c) 2025, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

/**
 * Raw app data as returned from the API
 */
export type RawApp = {
  id: string;
  name: string;
  label?: string;
  description?: string;
  templateSourceId?: string;
  templateType?: string;
  templateSubtype?: string;
  templateVersion?: string;
  namespace?: string;
  createdDate?: string;
  lastModifiedDate?: string;
  runtimeMethod?: string;
  logLevel?: string;
  status?: string;
  url?: string;
  configurationUrl?: string;
  readinessUrl?: string;
};

/**
 * Processed app data for display and usage in commands
 */
export type AppData = {
  id: string;
  name: string;
  label?: string;
  description?: string;
  templateSourceId?: string;
  templateType?: string;
  templateSubtype?: string;
  templateVersion?: string;
  namespace?: string;
  created?: string;
  modified?: string;
  runtimeMethod?: string;
  logLevel?: string;
  status?: string;
  url?: string;
  configurationUrl?: string;
  readinessUrl?: string;
};
