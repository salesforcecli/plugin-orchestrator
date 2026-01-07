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
