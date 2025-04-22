/*
 * Copyright (c) 2025, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
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
