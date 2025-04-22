/*
 * Copyright (c) 2025, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
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
