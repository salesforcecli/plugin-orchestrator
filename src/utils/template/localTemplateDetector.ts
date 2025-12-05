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

import * as fs from 'node:fs/promises';
import * as path from 'node:path';

export type LocalTemplate = {
  name: string;
  label?: string;
  description?: string;
  path: string;
  templateInfo?: TemplateInfo;
};

export type TemplateInfo = {
  name: string;
  label?: string;
  description?: string;
  templateType?: string;
  variableDefinition?: string;
  layoutDefinition?: string;
  rules?: Array<{
    type: string;
    file: string;
  }>;
  chainDefinitions?: Array<{
    type: string;
    name?: string;
    file: string;
  }>;
};

export class LocalTemplateDetector {
  private readonly TEMPLATE_PATHS = ['force-app/main/default/appTemplates', 'src/appTemplates'];

  /**
   * Check if a path exists
   */
  private static async pathExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Read and parse template-info.json
   */
  private static async readTemplateInfo(templateInfoPath: string): Promise<TemplateInfo | null> {
    try {
      const exists = await LocalTemplateDetector.pathExists(templateInfoPath);
      if (!exists) return null;

      const content = await fs.readFile(templateInfoPath, 'utf8');
      const parsed = JSON.parse(content) as TemplateInfo;
      return parsed;
    } catch (error) {
      return null;
    }
  }

  /**
   * Analyze a template directory to extract metadata
   */
  private static async analyzeTemplate(templatePath: string, dirName: string): Promise<LocalTemplate | null> {
    try {
      // Check if this is actually a directory
      const stat = await fs.stat(templatePath);
      if (!stat.isDirectory()) return null;

      // Look for template-info.json
      const templateInfoPath = path.join(templatePath, 'template-info.json');
      const templateInfo = await LocalTemplateDetector.readTemplateInfo(templateInfoPath);

      return {
        name: templateInfo?.name ?? dirName,
        label: templateInfo?.label,
        description: templateInfo?.description,
        path: templatePath,
        templateInfo: templateInfo ?? undefined,
      };
    } catch (error) {
      return null;
    }
  }

  /**
   * Discover all local templates in standard SFDX project paths
   */
  public async discoverLocalTemplates(projectRoot?: string): Promise<LocalTemplate[]> {
    const baseDir = projectRoot ?? process.cwd();

    // Process all template paths concurrently
    const pathPromises = this.TEMPLATE_PATHS.map(async (basePath) => {
      const fullBasePath = path.join(baseDir, basePath);

      try {
        const exists = await LocalTemplateDetector.pathExists(fullBasePath);
        if (!exists) return [];

        const templateDirs = await fs.readdir(fullBasePath);

        // Analyze all templates in parallel
        const templatePromises = templateDirs.map(async (templateDir) => {
          const templatePath = path.join(fullBasePath, templateDir);
          return LocalTemplateDetector.analyzeTemplate(templatePath, templateDir);
        });

        const templateResults = await Promise.all(templatePromises);
        return templateResults.filter((template): template is LocalTemplate => template !== null);
      } catch (error) {
        // Silently skip inaccessible paths
        return [];
      }
    });

    const allTemplateResults = await Promise.all(pathPromises);
    const templates = allTemplateResults.flat();

    return templates.sort((a, b) => (a.label ?? a.name).localeCompare(b.label ?? b.name));
  }

  /**
   * Read and parse template-info.json
   */
}
