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
