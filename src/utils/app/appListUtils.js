/*
 * Copyright (c) 2025, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

/**
 * Utility class for processing app data
 */
export class AppListUtil {
  /**
   * Process raw app data into formatted AppData objects
   *
   * @param {Array} rawApps - Raw app data from API
   * @returns {Array} Processed app data
   */
  static processApps(rawApps) {
    if (!rawApps || !Array.isArray(rawApps)) {
      return [];
    }

    return rawApps.map((app) => ({
      id: app.id,
      name: app.name,
      label: app.label,
      description: app.description,
      templateSourceId: app.templateSourceId,
      templateType: app.templateType,
      templateSubtype: app.templateSubtype,
      templateVersion: app.templateVersion,
      namespace: app.namespace,
      created: app.createdDate ? new Date(app.createdDate).toLocaleDateString() : undefined,
      modified: app.lastModifiedDate ? new Date(app.lastModifiedDate).toLocaleDateString() : undefined,
      runtimeMethod: app.runtimeMethod,
      logLevel: app.logLevel,
      status: app.status,
      url: app.url,
      configurationUrl: app.configurationUrl,
      readinessUrl: app.readinessUrl,
    }));
  }
}
