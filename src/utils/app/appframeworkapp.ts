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
import { Connection } from '@salesforce/core';
import { request } from '../request.js';
import { RawApp } from './appTypes.js';

export default class AppFrameworkApp {
  private readonly connection: Connection;

  public constructor(connection: Connection) {
    this.connection = connection;
  }

  /**
   * List apps in the org
   *
   * @returns Array of app objects
   */
  public async list(): Promise<RawApp[]> {
    const url = '/apps';
    const response = await request<{ apps: RawApp[] }>(this.connection, {
      method: 'GET',
      url,
    });
    return response?.apps ?? [];
  }

  /**
   * Get a specific app by ID or name
   *
   * @param idOrName - ID or name of the app to retrieve
   * @returns App object or null if not found
   */
  public async getApp(idOrName: string): Promise<RawApp | null> {
    if (!idOrName) {
      throw new Error('App ID or name must be provided');
    }

    try {
      const url = `/apps/${idOrName}`;
      const app = await request<RawApp>(this.connection, {
        method: 'GET',
        url,
      });
      return app;
    } catch (error) {
      if ((error as { statusCode?: number }).statusCode !== 404) {
        throw error;
      }
    }

    const apps = await this.list();
    const app = apps.find((a) => a.name === idOrName);
    return app ?? null;
  }

  /**
   * Create a new app from a template
   *
   * @param options - App creation options
   * @returns The ID of the newly created app
   */
  public async create(options: {
    name: string;
    label?: string;
    description?: string;
    templateSourceId: string;
    templateValues?: Record<string, unknown>;
    namespace?: string;
    runtimeMethod?: string;
    logLevel?: string;
  }): Promise<string> {
    const url = '/apps';

    const body = Object.fromEntries(
      Object.entries({
        name: options.name,
        label: options.label,
        description: options.description,
        templateSourceId: options.templateSourceId,
        templateValues: options.templateValues ?? {},
        namespace: options.namespace,
        runtimeMethod: options.runtimeMethod,
        logLevel: options.logLevel,
      }).filter((entries) => entries[1] !== undefined)
    );

    // Define response types to avoid 'any'
    type AppResponse = {
      id?: string;
      app?: { id: string };
      apps?: Array<{ id: string }>;
    };

    const response = await request<AppResponse>(this.connection, {
      method: 'POST',
      url,
      body,
    });

    if (response && typeof response === 'object') {
      if ('id' in response && typeof response.id === 'string') {
        return response.id;
      } else if ('app' in response && response.app && typeof response.app === 'object' && 'id' in response.app) {
        return response.app.id;
      } else if (
        'apps' in response &&
        Array.isArray(response.apps) &&
        response.apps.length > 0 &&
        response.apps[0]?.id
      ) {
        return response.apps[0].id;
      }
    }

    // Default return if no ID is found
    return 'App created successfully, but ID could not be determined';
  }

  /**
   * Decouple an app from its template
   * Removes references to the template from the source app
   *
   * @param appIdOrName - ID or name of the app to decouple
   * @returns App ID of the decoupled app
   */
  public async decoupleApp(appIdOrName: string): Promise<string> {
    if (!appIdOrName) {
      throw new Error('App ID or name must be provided');
    }

    const url = `/apps/${appIdOrName}/decouple`;

    // Define response types
    type AppResponse = {
      id?: string;
      app?: { id: string };
    };

    const response = await request<AppResponse>(this.connection, {
      method: 'POST',
      url,
      body: {}, // Send empty body for POST request
    });

    if (response && typeof response === 'object') {
      if ('id' in response && typeof response.id === 'string') {
        return response.id;
      } else if ('app' in response && response.app && typeof response.app === 'object' && 'id' in response.app) {
        return response.app.id;
      }
    }

    return appIdOrName; // Return the original app ID if no specific ID was found in the response
  }

  /**
   * Delete an app
   *
   * @param appId - ID of the app to delete
   */
  public async deleteApp(appId: string): Promise<void> {
    if (!appId) {
      throw new Error('App ID must be provided');
    }

    const url = `/apps/${appId}`;
    await request(this.connection, {
      method: 'DELETE',
      url,
    });
  }

  /**
   * Update an existing app with a new template
   *
   * @param appId - ID of the app to update
   * @param options - Update options
   * @returns The ID of the updated app
   */
  public async updateApp(
    appId: string,
    options: {
      templateSourceId: string;
      templateValues?: Record<string, unknown>;
      runtimeMethod?: string;
      logLevel?: string;
      chainName?: string;
    }
  ): Promise<string> {
    if (!appId) {
      throw new Error('App ID must be provided');
    }

    if (!options.templateSourceId) {
      throw new Error('Template ID must be provided for update');
    }

    const url = `/apps/${appId}`;

    const body = Object.fromEntries(
      Object.entries({
        templateSourceId: options.templateSourceId,
        templateValues: options.templateValues ?? {},
        runtimeMethod: options.runtimeMethod,
        logLevel: options.logLevel,
        chainName: options.chainName,
      }).filter((entries) => entries[1] !== undefined)
    );

    // Define response types
    type AppResponse = {
      id?: string;
      app?: { id: string };
    };

    const response = await request<AppResponse>(this.connection, {
      method: 'PUT',
      url,
      body,
    });

    if (response && typeof response === 'object') {
      if ('id' in response && typeof response.id === 'string') {
        return response.id;
      } else if ('app' in response && response.app && typeof response.app === 'object' && 'id' in response.app) {
        return response.app.id;
      }
    }

    return appId; // Return the original app ID if no specific ID was found in the response
  }

  /**
   * Patch an existing app's metadata (label, description)
   *
   * @param appId - ID of the app to patch
   * @param options - Patch options
   * @returns The ID of the patched app
   */
  public async patchApp(
    appId: string,
    options: {
      label?: string;
      description?: string;
    }
  ): Promise<string> {
    if (!appId) {
      throw new Error('App ID must be provided');
    }

    if (!options.label && !options.description) {
      throw new Error('At least one field (label or description) must be provided for patch');
    }

    const url = `/apps/${appId}`;

    const body = Object.fromEntries(
      Object.entries({
        label: options.label,
        description: options.description,
      }).filter((entries) => entries[1] !== undefined)
    );

    // Define response types
    type AppResponse = {
      id?: string;
      app?: { id: string };
    };

    const response = await request<AppResponse>(this.connection, {
      method: 'PATCH',
      url,
      body,
    });

    if (response && typeof response === 'object') {
      if ('id' in response && typeof response.id === 'string') {
        return response.id;
      } else if ('app' in response && response.app && typeof response.app === 'object' && 'id' in response.app) {
        return response.app.id;
      }
    }

    return appId; // Return the original app ID if no specific ID was found in the response
  }
}
