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
import { SfCommand, Flags } from '@salesforce/sf-plugins-core';
import { Messages, Connection } from '@salesforce/core';
import select from '@inquirer/select';
import { LocalTemplateDetector, LocalTemplate } from '../../../utils/template/localTemplateDetector.js';

Messages.importMessagesDirectoryFromMetaUrl(import.meta.url);
const messages = Messages.loadMessages('@salesforce/plugin-orchestrator', 'orchestrator.template.eval');

type TransformationPayload = {
  document: {
    user: {
      firstName: string;
      lastName: string;
      userName: string;
      id: string;
      hello: string;
    };
    company: {
      id: string;
      name: string;
      namespace: string;
    };
  };
  values: {
    Variables: {
      hello: string;
    };
  };
  definition: {
    rules: Array<{
      name: string;
      actions: Array<{
        action: string;
        description: string;
        key: string;
        path: string;
        value: string;
      }>;
    }>;
  };
};

type TemplateInfo = {
  name: string;
  path: string;
  source: 'static' | 'local';
};

export type TemplatePreviewResult = {
  status: 'success' | 'error';
  template?: TemplateInfo;
  input?: TransformationPayload;
  output?: unknown;
  error?: string;
  executionTime?: string;
};

export default class TemplateEval extends SfCommand<TemplatePreviewResult> {
  public static readonly summary = messages.getMessage('summary');
  public static readonly description = messages.getMessage('description');
  public static readonly examples = messages.getMessages('examples');

  public static readonly flags = {
    'target-org': Flags.requiredOrg({
      summary: messages.getMessage('flags.target-org.summary'),
      description: messages.getMessage('flags.target-org.description'),
      required: true,
    }),
    'api-version': Flags.orgApiVersion({
      summary: messages.getMessage('flags.api-version.summary'),
      description: messages.getMessage('flags.api-version.description'),
    }),
    'document-file': Flags.file({
      char: 'd',
      summary: messages.getMessage('flags.document-file.summary'),
      description: messages.getMessage('flags.document-file.description'),
      exclusive: ['template-path', 'template-name', 'no-prompt'],
    }),
    'values-file': Flags.file({
      char: 'v',
      summary: messages.getMessage('flags.values-file.summary'),
      description: messages.getMessage('flags.values-file.description'),
      dependsOn: ['document-file'],
    }),
    'definition-file': Flags.file({
      char: 'r',
      summary: messages.getMessage('flags.definition-file.summary'),
      description: messages.getMessage('flags.definition-file.description'),
      dependsOn: ['document-file'],
    }),
    'template-path': Flags.directory({
      char: 'p',
      summary: messages.getMessage('flags.template-path.summary'),
      description: messages.getMessage('flags.template-path.description'),
      exclusive: ['template-name', 'document-file'],
    }),
    'template-name': Flags.string({
      char: 't',
      summary: messages.getMessage('flags.template-name.summary'),
      description: messages.getMessage('flags.template-name.description'),
      exclusive: ['template-path', 'document-file'],
    }),
    'project-dir': Flags.directory({
      summary: messages.getMessage('flags.project-dir.summary'),
      description: messages.getMessage('flags.project-dir.description'),
    }),
    'no-prompt': Flags.boolean({
      summary: messages.getMessage('flags.no-prompt.summary'),
      description: messages.getMessage('flags.no-prompt.description'),
      exclusive: ['document-file'],
    }),
  };

  public async run(): Promise<TemplatePreviewResult> {
    const { flags } = await this.parse(TemplateEval);

    try {
      type OrgType = { getConnection(apiVersion?: string): Connection };
      const connection = (flags['target-org'] as OrgType).getConnection(flags['api-version']);

      // Determine template source and payload
      const templateResult = await this.getTemplatePayload(flags);

      this.log(`Testing transformation: ${templateResult.template.name}`);
      this.log(`Source: ${templateResult.template.source}`);

      if (templateResult.template.source === 'local') {
        this.log(`Path: ${templateResult.template.path}`);
      }

      const startTime = Date.now();

      // Make request to jsonxform/transformation endpoint
      const apiPath = `/services/data/v${connection.getApiVersion()}/jsonxform/transformation`;

      const result = await connection.request({
        method: 'POST',
        url: apiPath,
        body: JSON.stringify(templateResult.payload),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const executionTime = `${Date.now() - startTime}ms`;

      this.log('Transformation completed successfully!');
      this.log('Results:');
      this.log(JSON.stringify(result, null, 2));

      return {
        status: 'success',
        template: templateResult.template,
        input: templateResult.payload,
        output: result,
        executionTime,
      };
    } catch (error) {
      this.log(`Transformation failed: ${(error as Error).message}`);

      return {
        status: 'error',
        error: (error as Error).message,
      };
    }
  }

  private async getTemplatePayload(flags: {
    'template-path'?: string;
    'template-name'?: string;
    'project-dir'?: string;
    'no-prompt'?: boolean;
    'document-file'?: string;
    'values-file'?: string;
    'definition-file'?: string;
  }): Promise<{
    template: TemplateInfo;
    payload: TransformationPayload;
  }> {
    // If direct file paths are provided, use them
    if (flags['document-file']) {
      return this.getDirectFilePayload(flags['document-file'], flags['values-file'], flags['definition-file']);
    }

    // If no template flags provided, discover local templates and prompt for selection
    if (!flags['template-path'] && !flags['template-name']) {
      // If no-prompt flag is set, require template specification
      if (flags['no-prompt']) {
        throw new Error(
          'No template specified. Use --template-path, --template-name, or --document-file when using --no-prompt.'
        );
      }

      const detector = new LocalTemplateDetector();
      const templates = await detector.discoverLocalTemplates(flags['project-dir']);

      if (templates.length === 0) {
        throw new Error(
          'No local templates found. Use --template-path or --document-file to specify template files directly.'
        );
      }

      return this.promptForTemplateSelection(templates);
    }

    // If template path is provided directly
    if (flags['template-path']) {
      return this.getLocalTemplatePayload(flags['template-path']);
    }

    // If template name is provided, search for it
    if (flags['template-name']) {
      const detector = new LocalTemplateDetector();
      const templates = await detector.discoverLocalTemplates(flags['project-dir']);

      const foundTemplate = templates.find(
        (t) => t.name === flags['template-name'] || t.label === flags['template-name']
      );

      if (!foundTemplate) {
        throw new Error(
          `Template '${flags['template-name']}' not found. Available templates: ${templates
            .map((t) => t.name)
            .join(', ')}`
        );
      }

      return this.getLocalTemplatePayload(foundTemplate.path);
    }

    throw new Error('No template specified. Use --template-path, --template-name, or --document-file.');
  }

  private async promptForTemplateSelection(templates: LocalTemplate[]): Promise<{
    template: TemplateInfo;
    payload: TransformationPayload;
  }> {
    // Build choices for inquirer select
    const choices = templates.map((template) => {
      const displayName = template.label ?? template.name;
      const description = template.description ? ` - ${template.description}` : '';
      return {
        name: `${displayName}${description}`,
        value: template.path,
      };
    });

    const selectedValue = await select({
      message: 'Select a template to preview:',
      choices,
      pageSize: 10,
    });

    // Find the selected template
    const selectedTemplate = templates.find((t) => t.path === selectedValue);
    if (selectedTemplate) {
      const displayName = selectedTemplate.label ?? selectedTemplate.name;
      this.log(`Selected: ${displayName}`);
      return this.getLocalTemplatePayload(selectedTemplate.path);
    }

    // Fallback (should not happen)
    throw new Error('Selected template not found.');
  }

  private getLocalTemplatePayload(templatePath: string): {
    template: TemplateInfo;
    payload: TransformationPayload;
  } {
    // For now, return static payload but indicate it's from local template
    // TODO: Parse actual template files
    const templateName = templatePath.split('/').pop() ?? 'Unknown Template';

    this.log(`Local template parsing not yet implemented. Using static rules for: ${templateName}`);

    return {
      template: {
        name: templateName,
        path: templatePath,
        source: 'local',
      },
      payload: {
        document: {
          user: {
            firstName: '',
            lastName: '',
            userName: '',
            id: '',
            hello: '',
          },
          company: {
            id: '',
            name: '',
            namespace: '',
          },
        },
        values: { Variables: { hello: '' } },
        definition: { rules: [] },
      },
    };
  }

  private async getDirectFilePayload(
    documentFile: string,
    valuesFile?: string,
    definitionFile?: string
  ): Promise<{
    template: TemplateInfo;
    payload: TransformationPayload;
  }> {
    this.log(`Loading document: ${documentFile}`);

    // Read and parse the document file
    const documentContent = await fs.readFile(documentFile, 'utf8');
    const document = JSON.parse(documentContent) as unknown;

    // Read values file if provided, otherwise use empty object
    let values = { Variables: { hello: 'world' } };
    if (valuesFile) {
      this.log(`Loading values: ${valuesFile}`);
      const valuesContent = await fs.readFile(valuesFile, 'utf8');
      values = JSON.parse(valuesContent) as typeof values;
    }

    // Read definition file if provided, otherwise use empty rules
    let definition = { rules: [] };
    if (definitionFile) {
      this.log(`Loading definition: ${definitionFile}`);
      const definitionContent = await fs.readFile(definitionFile, 'utf8');
      definition = JSON.parse(definitionContent) as typeof definition;
    }

    return {
      template: {
        name: 'Direct Files',
        path: documentFile,
        source: 'local' as const,
      },
      payload: {
        document: document as TransformationPayload['document'],
        values: values as TransformationPayload['values'],
        definition: definition as TransformationPayload['definition'],
      },
    };
  }
}
