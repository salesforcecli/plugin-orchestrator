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
import { TemplateData, RawTemplate, Icon, Rule } from './templateTypes.js';

// Type for output fields
export type TemplateOutputField = keyof TemplateData;

// Type for output record - updated to allow number, Icon and Rule[] types
export type TemplateOutput = Record<string, string | number | Icon | Rule[] | undefined>;

// Define standard field sets
export const DETAILED_FIELDS: TemplateOutputField[] = [
  'name',
  'label',
  'templateId',
  'templateType',
  'namespace',
  'templateVersion',
  'created',
  'modified',
  'description',
  'industries',
  'audience',
];

export const SIMPLE_FIELDS: TemplateOutputField[] = [
  'label',
  'templateId',
  'name',
  'templateType',
  'templateSubtype',
  'templateVersion',
  'applicationSourceId',
];

/**
 * Helper for date formatting
 */
const formatDate = (dateString?: string): string => (dateString ? new Date(dateString).toLocaleDateString() : 'n/a');

/**
 * Helper for default values
 */
const defaultIfEmpty = (value?: string | string[], defaultValue = 'n/a'): string =>
  value ? (Array.isArray(value) ? value.join(', ') : value) : defaultValue;

/**
 * Capitalize the first letter of a string
 */
const capitalizeFirstLetter = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1);

/**
 * Process a single raw template into a structured format
 *
 * @param rawTemplate - Raw template data from the API
 * @returns Processed template data
 */
const processTemplate = (rawTemplate: RawTemplate): TemplateData => ({
  id: rawTemplate.id,
  name: rawTemplate.name,
  label: rawTemplate.label,
  description: rawTemplate.description,
  templateType: rawTemplate.templateType,
  templateId: rawTemplate.templateId,
  folderId: rawTemplate.folderId,
  namespace: rawTemplate.namespace,
  templateVersion: rawTemplate.releaseInfo?.templateVersion,
  assetVersion: rawTemplate.assetVersion,
  created: formatDate(rawTemplate.createdDate),
  modified: formatDate(rawTemplate.lastModifiedDate),
  industries: defaultIfEmpty(rawTemplate.tags?.industries),
  audience: defaultIfEmpty(rawTemplate.tags?.targetAudience),
  templateSubtype: rawTemplate.templateSubtype,
  applicationSourceId: rawTemplate.applicationSourceId,
});

/**
 * Process raw templates from the API into a structured format
 *
 * @param rawTemplates - Raw template data from the API
 * @returns Processed template data
 */
export const processTemplates = (rawTemplates: RawTemplate[]): TemplateData[] => {
  if (!rawTemplates?.length) {
    return [];
  }

  return rawTemplates.map(processTemplate);
};

/**
 * Process templates for display with customizable field selection
 *
 * @param templates - Template data array
 * @param fields - Fields to include in the output
 * @returns Processed template data for display
 */
export const processTemplateOutput = (
  templates: TemplateData[],
  fields: TemplateOutputField[] = DETAILED_FIELDS
): TemplateOutput[] =>
  templates.map((template) => {
    const output: TemplateOutput = {};

    fields.forEach((field) => {
      const value = template[field];

      // Special case for applicationSourceId to match the expected "SourceID" in tests
      if (field === 'applicationSourceId') {
        output['SourceID'] = value ?? 'n/a';
      }
      // Special case for templateType to match the expected "Type" in tests
      else if (field === 'templateType') {
        output['Type'] = value ?? 'n/a';
      }
      // Special case for templateSubtype to match the expected "SubType" in tests
      else if (field === 'templateSubtype') {
        output['SubType'] = value ?? 'n/a';
      }
      // Special case for templateVersion to match the expected "Version" in tests
      else if (field === 'templateVersion') {
        output['Version'] = value ?? 'n/a';
      } else {
        output[capitalizeFirstLetter(field.toString())] = value ?? 'n/a';
      }
    });

    return output;
  });

/**
 * Process templates for detailed display
 *
 * @param templates - Template data array
 * @returns Processed template data for detailed display
 */
export const processOutput = (templates: TemplateData[]): TemplateOutput[] =>
  processTemplateOutput(templates, DETAILED_FIELDS);

/**
 * Process templates for simple display
 *
 * @param templates - Template data array
 * @returns Processed template data for simple display
 */
export const processSimpleOutput = (templates: TemplateData[]): TemplateOutput[] =>
  processTemplateOutput(templates, SIMPLE_FIELDS);

// For backward compatibility with code that uses the class-based approach
export class TemplateListUtil {
  public static processTemplates = processTemplates;
  public static processOutput = processOutput;
  public static processSimpleOutput = processSimpleOutput;
  public static processTemplate = processTemplate;
}
