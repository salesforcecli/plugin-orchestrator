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
      required: true,
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
    'document-file': string;
    'values-file'?: string;
    'definition-file'?: string;
  }): Promise<{
    template: TemplateInfo;
    payload: TransformationPayload;
  }> {
    return this.getDirectFilePayload(flags['document-file'], flags['values-file'], flags['definition-file']);
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
