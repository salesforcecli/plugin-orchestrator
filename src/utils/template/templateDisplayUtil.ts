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

import ansis from 'ansis';
import { SfCommand } from '@salesforce/sf-plugins-core';
import { TemplateData } from './templateTypes.js';
export class TemplateDisplayUtil {
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

  /**
   * Display detailed information about a single template
   *
   * @param command - The SfCommand instance
   * @param template - The template data to display
   */
  public static displayTemplateDetail(command: SfCommand<unknown>, template: TemplateData): void {
    const templateTypeString = String(template.templateType ?? 'unknown');
    const typeColor = this.getTemplateTypeColor(templateTypeString);
    const templateLabel = String(template.label ?? template.name ?? template.id);

    command.log('');
    command.styledHeader(`Template Details: ${typeColor(templateLabel)}`);

    this.displaySection(command, 'Basic Information', {
      ID: template.id,
      Name: template.name,
      Label: template.label,
      Description: template.description,
      Type: typeColor(templateTypeString),
      Subtype: template.templateSubtype,
      Namespace: template.namespace,
      'Origin App ID': template.applicationSourceId,
      'Max App Count': template.maxAppCount,
    });

    this.displaySection(command, 'Version Information', {
      'Template Version': template.templateVersion,
      'Asset Version': template.assetVersion,
      Created: ansis.dim(template.created ?? 'n/a'),
      'Last Modified': ansis.dim(template.modified ?? 'n/a'),
    });

    this.displaySection(command, 'References', {
      'Template ID': template.templateId,
      'Folder ID': template.folderId,
      'API URL': template.url,
      'Configuration URL': template.configurationUrl,
      'Readiness URL': template.readinessUrl,
    });

    this.displaySection(command, 'Content Details', {
      Industries: template.industries,
      'Target Audience': template.audience,
      'Rules Count': template.rules?.length ?? 0,
      'Chain Definitions Count': template.chainDefinitions?.length ?? 0,
      'Has Icons': template.icons ? 'Yes' : 'No',
      'Has Variable Definition': template.variableDefinition ? 'Yes' : 'No',
      'Has Layout Definition': template.layoutDefinition ? 'Yes' : 'No',
    });
  }

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

    command.styledHeader(`Found ${templates.length} template(s)`);

    const tableData = templates.map((template) => {
      const typeString = String(template.templateType ?? 'n/a');

      const typeWithColor = this.getTemplateTypeColor(typeString)(typeString);

      return {
        Id: template.id ?? 'n/a',
        Type: typeWithColor,
        Version: template.templateVersion ?? 'n/a',
        Subtype: template.templateSubtype ?? 'n/a',
        Name: template.name ?? 'n/a',
        Label: template.label ?? 'n/a',
      };
    });

    command.table({
      data: tableData,
      title,
      columns: [
        { key: 'Id', width: '30%' },
        { key: 'Name', width: '25%' },
        { key: 'Label', width: '25%' },
        { key: 'Type', width: '10%' },
        { key: 'Subtype', width: '5%' },
        { key: 'Version', width: '5%' },
      ],
      overflow: 'truncate-end',
      sort: {
        Label: 'asc',
      },
    });

    command.log('');
    command.log(
      `Legend: ${ansis.green('app')} - Application templates, ${ansis.blue(
        'component'
      )} - Component templates, ${ansis.yellow('other')} - Other template types`
    );
    command.log('');
  }

  /**
   * Get color function based on template type
   *
   * @param templateType - The template type string
   * @returns A color function to apply to text
   */
  private static getTemplateTypeColor(templateType: string): (text: string) => string {
    const typeString = templateType.toLowerCase();
    if (typeString === 'app') {
      return ansis.green;
    } else if (typeString === 'component') {
      return ansis.blue;
    }
    return ansis.yellow;
  }

  /**
   * Display a section of template details
   *
   * @param command - The command instance
   * @param title - Section title
   * @param details - Key-value pairs to display
   */
  private static displaySection(command: SfCommand<unknown>, title: string, details: Record<string, unknown>): void {
    command.log(ansis.bold(`=== ${title}`));

    for (const [key, value] of Object.entries(details)) {
      const formattedValue = value === null || value === undefined ? 'n/a' : String(value);
      command.log(`${ansis.bold(`${key}:`)} ${formattedValue}`);
    }

    command.log('');
  }
}
