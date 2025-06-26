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
import { Connection } from '@salesforce/core';
import { request } from '../request.js';
import { RawTemplate } from './templateTypes.js';

export default class AppFrameworkTemplate {
  private readonly connection: Connection;

  public constructor(connection: Connection) {
    this.connection = connection;
  }

  /**
   * List templates in the org
   *
   * @returns Array of template objects
   */
  public async list(): Promise<RawTemplate[]> {
    const url = '/templates';
    const response = await request<{ templates: RawTemplate[] }>(this.connection, {
      method: 'GET',
      url,
    });
    return response?.templates ?? [];
  }

  /**
   * Get a specific template by ID or name
   *
   * @param idOrName - ID or name of the template to retrieve
   * @returns Template object or null if not found
   */
  public async getTemplate(idOrName: string): Promise<RawTemplate | null> {
    if (!idOrName) {
      throw new Error('Template ID or name must be provided');
    }

    try {
      const url = `/templates/${idOrName}`;
      const template = await request<RawTemplate>(this.connection, {
        method: 'GET',
        url,
      });
      return template;
    } catch (error) {
      if ((error as { statusCode?: number }).statusCode !== 404) {
        throw error;
      }
    }

    const templates = await this.list();
    const template = templates.find((t) => t.name === idOrName);
    return template ?? null;
  }

  /**
   * Create a new template
   *
   * @param options - Template creation options
   * @returns The ID of the newly created template
   */
  public async create(options: {
    name: string;
    templateType?: string;
    templateSubtype?: string;
    label?: string;
    description?: string;
    maxAppCount?: number;
    tags?: {
      industries?: string[];
      targetAudience?: string[];
      highlights?: string[];
      requirements?: string[];
      includes?: string[];
      categories?: string[];
    };
    releaseInfo?: {
      templateVersion?: string;
      notesFile?: string | null;
    };
  }): Promise<string> {
    const url = '/templates';

    const body = Object.fromEntries(
      Object.entries({
        name: options.name,
        templateType: options.templateType ?? 'app',
        templateSubtype: options.templateSubtype,
        label: options.label,
        description: options.description,
        maxAppCount: options.maxAppCount,
        tags: options.tags,
        releaseInfo: options.releaseInfo,
      }).filter((entries) => entries[1] !== undefined)
    );

    const response = await request<{ id: string }>(this.connection, {
      method: 'POST',
      url,
      body,
    });

    return response.id;
  }

  /**
   * Update an existing template
   *
   * Note: Only label and description fields can be updated directly.
   * The template's name cannot be updated as it's a unique identifier.
   *
   * @param templateIdOrName - ID or name of the template to update
   * @param options - Optional update options
   * @param options.label - Optional new label for the template
   * @param options.description - Optional new description for the template
   * @returns The updated template data
   */
  public async update(
    templateIdOrName: string,
    options?: {
      label?: string;
      description?: string;
    }
  ): Promise<RawTemplate> {
    const template = await this.getTemplate(templateIdOrName);
    if (!template) {
      throw new Error(`Template "${templateIdOrName}" not found`);
    }

    const url = `/templates/${template.id}`;

    const body = Object.fromEntries(
      Object.entries({
        label: options?.label,
        description: options?.description,
      }).filter((entries) => entries[1] !== undefined)
    );

    const response = await request<RawTemplate>(this.connection, {
      method: 'PATCH',
      url,
      body,
    });

    return response;
  }

  /**
   * Delete a template
   *
   * @param templateId - ID of the template to delete
   */
  public async deleteTemplate(templateId: string): Promise<void> {
    const url = `/templates/${templateId}`;
    await request(this.connection, {
      method: 'DELETE',
      url,
    });
  }
}
