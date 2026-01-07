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
import ansis, { type Ansis } from 'ansis';
import { TemplateData } from './templateTypes.js';

const styledProperties = new Map<string, Map<string, Ansis>>([
  [
    'templateType',
    new Map([
      ['app', ansis.greenBright],
      ['component', ansis.cyanBright],
      ['else', ansis.yellowBright],
    ]),
  ],
  ['templateVersion', new Map([['else', ansis.blue]])],
]);

/**
 * Style a value based on predefined styling rules
 *
 * @param key - The field name to style
 * @param value - The value to style
 * @returns The styled value
 */
export const getStyledValue = (key: string, value: string | null | undefined): string => {
  if (value === null || value === undefined) return '';

  const prop = styledProperties.get(key);
  if (!prop) return value;

  const colorMethod = prop.get(value) ?? (prop.get('else') as Ansis);
  return colorMethod(value);
};

/**
 * Apply styling to all fields in a template object based on predefined rules
 *
 * @param objectToStyle - The template object to style
 * @returns A new object with styled field values
 */
export const getStyledObject = (objectToStyle: TemplateData): TemplateData =>
  Object.fromEntries(
    Object.entries(objectToStyle).map(([key, value]) => [
      key,
      typeof value === 'string' ? getStyledValue(key, value) : value,
    ])
  ) as TemplateData;

/**
 * Group templates by type for better organization
 *
 * @param templates - Array of template data
 * @returns Object with templates grouped by type
 */
export const groupTemplatesByType = (templates: TemplateData[]): Record<string, TemplateData[]> => {
  const groups: Record<string, TemplateData[]> = {
    app: [],
    component: [],
    other: [],
  };

  templates.forEach((template) => {
    const type = template.templateType?.toLowerCase() ?? 'other';
    if (type === 'app' || type === 'component') {
      groups[type].push(template);
    } else {
      groups.other.push(template);
    }
  });

  return groups;
};
