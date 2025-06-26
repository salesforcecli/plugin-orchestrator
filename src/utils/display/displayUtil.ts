/*
 * Copyright 2025, Salesforce, Inc.
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

import { SfCommand } from '@salesforce/sf-plugins-core';
import { TemplateData } from '../template/templateTypes.js';

export class TemplateDisplayUtil {
  /**
   * Display a list of templates in a table format
   *
   * @param command - The SfCommand instance
   * @param templates - The template data to display
   * @param title - Optional title for the table
   */
  public static displayTemplateList(
    command: SfCommand<unknown>,
    templates: TemplateData[],
    title = 'AppFramework Templates'
  ): void {
    if (templates.length === 0) {
      command.log('No templates found.');
      return;
    }

    command.log('');
    command.styledHeader(`Found ${templates.length} template(s)`);

    const tableData = templates.map((template) => ({
      ...template,
    }));

    command.table({
      data: tableData,
      title,
      columns: ['id', 'name', 'label', 'namespace', 'templateSubtype', 'applicationSourceId'],
      sort: {
        label: 'asc',
      },
    });
    command.log('');
  }

  /**
   * Display detailed information about a single template
   *
   * @param command - The SfCommand instance
   * @param template - The template data to display
   */
  public static displayTemplateDetail(command: SfCommand<unknown>, template: TemplateData): void {
    command.log('');
    command.styledHeader(`Template Details: ${String(template.label ?? template.name ?? template.id)}`);

    command.log('=== Basic Information');
    command.log(`ID:             ${template.id ?? 'n/a'}`);
    command.log(`Name:           ${template.name ?? 'n/a'}`);
    command.log(`Label:          ${template.label ?? 'n/a'}`);
    command.log(`Description:    ${template.description ?? 'n/a'}`);
    command.log(`Type:           ${template.templateType ?? 'n/a'}`);
    command.log(`Subtype:        ${template.templateSubtype ?? 'n/a'}`);
    command.log(`Namespace:      ${template.namespace ?? 'n/a'}`);
    command.log(`Origin App ID:  ${template.applicationSourceId ?? 'n/a'}`);
    command.log('');

    command.log('=== Version Information');
    command.log(`Template Version: ${template.templateVersion ?? 'n/a'}`);
    command.log(`Asset Version:    ${template.assetVersion ?? 'n/a'}`);
    command.log(`Created:          ${template.created ?? 'n/a'}`);
    command.log(`Last Modified:    ${template.modified ?? 'n/a'}`);
    command.log('');

    command.log('=== References');
    command.log(`Template ID:      ${template.templateId ?? 'n/a'}`);
    command.log(`Folder ID:        ${template.folderId ?? 'n/a'}`);
    command.log('');

    command.log('=== Content Details');
    command.log(`Industries:       ${template.industries ?? 'n/a'}`);
    command.log(`Target Audience:  ${template.audience ?? 'n/a'}`);
    command.log('');
  }

  /**
   * Process templates data for table display
   * This can be expanded with any additional processing needs
   *
   * @param templates - Raw template data
   * @returns Processed template data ready for display
   */
  public static processTemplatesForDisplay(templates: TemplateData[]): TemplateData[] {
    return templates;
  }
}
