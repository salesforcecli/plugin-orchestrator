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
 * Template type enum
 */
export enum TemplateType {
  DASHBOARD = 'dashboard',
  LIBRARY = 'library',
}

export type FolderSource = {
  id?: string;
  name?: string;
};

export type ReleaseInfo = {
  templateVersion?: string;
  notesFile?: string | null;
};

export type ChainDefinition = {
  type?: string;
  file?: string;
  name?: string | null;
  dominoChainId?: string | null;
};

export type Rule = {
  type?: string;
  file?: string;
};

export type Icon = {
  appBadge?: string | null;
  templatePreviews?: Array<{
    namespace?: string | null;
    name?: string | null;
    id?: string | null;
    url?: string | null;
    label?: string | null;
    description?: string | null;
  }> | null;
  templateBadge?: {
    name?: string;
    url?: string;
  } | null;
};

export type Tags = {
  [key: string]: unknown;
  highlights?: string[];
  targetAudience?: string[];
  industries?: string[];
  requirements?: string[];
  includes?: string[];
  categories?: string[];
};

/**
 * Interface for raw template data returned from the API
 */
export type RawTemplate = {
  id: string;
  name?: string;
  label?: string;
  description?: string;
  templateType?: string;
  templateSubtype?: string | null;
  templateId?: string;
  folderId?: string;
  namespace?: string | null;
  releaseInfo?: ReleaseInfo;
  assetVersion?: number;
  maxAppCount?: number | null;
  variableDefinition?: null;
  layoutDefinition?: null;
  rules?: Rule[];
  createdDate?: string;
  lastModifiedDate?: string;
  tags?: Tags;
  icons?: Icon | null;
  chainDefinitions?: ChainDefinition[];
  applicationSourceId?: string | null;
  folderSource?: FolderSource;
  url?: string;
  configurationUrl?: string;
  readinessUrl?: string;
};

/**
 * Interface for processed template data used in the UI
 * Alias RawTemplateData to RawTemplate for backward compatibility
 */
export type RawTemplateData = RawTemplate;

/**
 * Interface for processed template data used in the UI
 */
export type TemplateData = {
  id?: string;
  name?: string;
  label?: string;
  description?: string;
  templateType?: string;
  templateSubtype?: string | null;
  templateId?: string;
  folderId?: string;
  namespace?: string | null;
  templateVersion?: string;
  assetVersion?: number;
  maxAppCount?: number | null;
  variableDefinition?: null;
  layoutDefinition?: null;
  rules?: Rule[];
  created?: string;
  modified?: string;
  industries?: string;
  audience?: string;
  icons?: Icon | null;
  chainDefinitions?: ChainDefinition[];
  applicationSourceId?: string | null;
  url?: string;
  configurationUrl?: string;
  readinessUrl?: string;
};
