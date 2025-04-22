/*
 * Copyright (c) 2025, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { AppData, RawApp } from './appTypes.js';

/**
 * Utility class for processing app list data
 */
export class AppListUtil {
  /**
   * Process raw apps from the API into a structured format
   *
   * @param rawApps - Raw app data from the API
   * @returns Processed app data
   */
  public static processApps(rawApps: RawApp[]): AppData[] {
    if (!rawApps || !Array.isArray(rawApps)) {
      return [];
    }

    return rawApps.map((app) => this.processApp(app));
  }

  /**
   * Process apps for display
   *
   * @param apps - App data array
   * @returns Processed app data for display
   */
  public static processOutput(apps: AppData[]): Array<Record<string, string | undefined>> {
    return apps.map((app) => ({
      Name: app.name,
      Label: app.label,
      ID: app.id,
      Type: app.templateType,
      'Template ID': app.templateSourceId,
      Status: app.status,
      Created: app.created,
      Modified: app.modified,
      Description: app.description ?? 'n/a',
    }));
  }

  /**
   * Process apps for simple display
   *
   * @param apps - App data array
   * @returns Processed app data for simple display
   */
  public static processSimpleOutput(apps: AppData[]): Array<Record<string, string | undefined>> {
    return apps.map((app) => ({
      ID: app.id,
      Name: app.name,
      Label: app.label,
      Type: app.templateType,
      SubType: app.templateSubtype ?? 'n/a',
      'Template ID': app.templateSourceId ?? 'n/a',
      Status: app.status ?? 'n/a',
    }));
  }

  /**
   * Process a single raw app into a structured format
   *
   * @param rawApp - Raw app data from the API
   * @returns Processed app data
   */
  private static processApp(rawApp: RawApp): AppData {
    return {
      id: rawApp.id,
      name: rawApp.name,
      label: rawApp.label,
      description: rawApp.description,
      templateSourceId: rawApp.templateSourceId,
      templateType: rawApp.templateType,
      templateSubtype: rawApp.templateSubtype,
      templateVersion: rawApp.templateVersion,
      namespace: rawApp.namespace,
      created: rawApp.createdDate ? new Date(rawApp.createdDate).toLocaleDateString() : 'n/a',
      modified: rawApp.lastModifiedDate ? new Date(rawApp.lastModifiedDate).toLocaleDateString() : 'n/a',
      runtimeMethod: rawApp.runtimeMethod,
      logLevel: rawApp.logLevel,
      status: rawApp.status,
      url: rawApp.url,
      configurationUrl: rawApp.configurationUrl,
      readinessUrl: rawApp.readinessUrl,
    };
  }
}
