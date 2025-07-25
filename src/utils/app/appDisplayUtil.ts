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
import { AppData } from './appTypes.js';

export class AppDisplayUtil {
  /**
   * Get color formatting function based on app template type
   *
   * @param templateType - The template type of the app
   * @returns Function to format text with appropriate color
   */
  public static getAppTypeColor(templateType: string): (text: string) => string {
    switch (templateType.toLowerCase()) {
      case 'app':
        return ansis.green;
      case 'component':
        return ansis.blue;
      default:
        return ansis.yellow;
    }
  }

  /**
   * Display a list of apps in a table format
   *
   * @param command - The SfCommand instance
   * @param apps - The app data to display
   * @param title - Optional title for the table
   */
  public static displayAppList(command: SfCommand<unknown>, apps: AppData[], title = 'Apps'): void {
    if (apps.length === 0) {
      command.log('No apps found.');
      return;
    }

    command.styledHeader(`Found ${apps.length} app(s)`);

    const tableData = apps.map((app) => {
      const typeString = String(app.templateType ?? 'n/a');
      const typeWithColor = this.getAppTypeColor(typeString)(typeString);

      return {
        Id: app.id ?? 'n/a',
        Type: typeWithColor,
        Version: app.templateVersion ?? 'n/a',
        Subtype: app.templateSubtype ?? 'n/a',
        Name: app.name ?? 'n/a',
        Label: app.label ?? 'n/a',
        Status: app.status ?? 'n/a',
      };
    });

    command.table({
      data: tableData,
      title,
      columns: [
        { key: 'Id', width: '30%' },
        { key: 'Name', width: '20%' },
        { key: 'Label', width: '20%' },
        { key: 'Type', width: '10%' },
        { key: 'Subtype', width: '5%' },
        { key: 'Status', width: '10%' },
        { key: 'Version', width: '5%' },
      ],
      overflow: 'truncate-end',
      sort: {
        Label: 'asc',
      },
    });

    command.log('');
    command.log(
      `Legend: ${ansis.green('app')}, ${ansis.blue('component')}, ${ansis.yellow('other')} - Other app types`
    );
    command.log('');
  }

  /**
   * Display detailed information about an app in sections
   *
   * @param command - The SfCommand instance
   * @param app - The app data to display
   */
  public static displayAppDetails(command: SfCommand<unknown>, app: AppData): void {
    if (!app) {
      command.log('No app data to display.');
      return;
    }

    command.styledHeader(`App Details: ${app.name ?? 'n/a'}`);

    // Basic Information
    command.styledHeader('Basic Information');
    command.table({
      data: [
        { Property: 'ID', Value: app.id ?? 'n/a' },
        { Property: 'Name', Value: app.name ?? 'n/a' },
        { Property: 'Label', Value: app.label ?? 'n/a' },
        { Property: 'Description', Value: app.description ?? 'n/a' },
        { Property: 'Status', Value: app.status ?? 'n/a' },
      ],
      columns: [
        { key: 'Property', width: '30%' },
        { key: 'Value', width: '70%' },
      ],
    });

    // Template Information
    command.styledHeader('Template Information');
    command.table({
      data: [
        { Property: 'Template ID', Value: app.templateSourceId ?? 'n/a' },
        { Property: 'Template Type', Value: app.templateType ?? 'n/a' },
        { Property: 'Template Subtype', Value: app.templateSubtype ?? 'n/a' },
        { Property: 'Template Version', Value: app.templateVersion ?? 'n/a' },
      ],
      columns: [
        { key: 'Property', width: '30%' },
        { key: 'Value', width: '70%' },
      ],
    });

    // Runtime Information
    command.styledHeader('Runtime Information');
    command.table({
      data: [
        { Property: 'Runtime Method', Value: app.runtimeMethod ?? 'n/a' },
        { Property: 'Log Level', Value: app.logLevel ?? 'n/a' },
        { Property: 'Namespace', Value: app.namespace ?? 'n/a' },
      ],
      columns: [
        { key: 'Property', width: '30%' },
        { key: 'Value', width: '70%' },
      ],
    });

    // Date Information
    command.styledHeader('Date Information');
    command.table({
      data: [
        { Property: 'Created', Value: app.created ?? 'n/a' },
        { Property: 'Modified', Value: app.modified ?? 'n/a' },
      ],
      columns: [
        { key: 'Property', width: '30%' },
        { key: 'Value', width: '70%' },
      ],
    });

    // URLs
    command.styledHeader('URLs');
    command.table({
      data: [
        { Property: 'URL', Value: app.url ?? 'n/a' },
        { Property: 'Configuration URL', Value: app.configurationUrl ?? 'n/a' },
        { Property: 'Readiness URL', Value: app.readinessUrl ?? 'n/a' },
      ],
      columns: [
        { key: 'Property', width: '30%' },
        { key: 'Value', width: '70%' },
      ],
    });
  }
}
