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

import { Flags, SfCommand } from '@salesforce/sf-plugins-core';
import { Messages, SfError, Connection } from '@salesforce/core';

import AppFrameworkTemplate from '../../../utils/template/appframeworktemplate.js';
import { TemplateData } from '../../../utils/template/templateTypes.js';
import { TemplateDisplayUtil } from '../../../utils/template/templateDisplayUtil.js';

Messages.importMessagesDirectoryFromMetaUrl(import.meta.url);
const messages = Messages.loadMessages('@salesforce/plugin-orchestrator', 'appframework.update.template');

export default class UpdateTemplate extends SfCommand<TemplateData> {
  public static readonly summary = messages.getMessage('summary');
  public static readonly description = messages.getMessage('description');
  public static readonly examples = messages.getMessages('examples');
  public static readonly state = 'preview';

  public static readonly flags = {
    'target-org': Flags.requiredOrg({
      summary: messages.getMessage('flags.target-org.summary'),
      required: true,
    }),
    'api-version': Flags.orgApiVersion({
      summary: messages.getMessage('flags.api-version.summary'),
      description: messages.getMessage('flags.api-version.description'),
    }),
    'template-id': Flags.string({
      char: 'i',
      summary: messages.getMessage('flags.template-id.summary'),
      description: messages.getMessage('flags.template-id.description'),
      exclusive: ['template-name'],
    }),
    'template-name': Flags.string({
      char: 'n',
      summary: messages.getMessage('flags.template-name.summary'),
      description: messages.getMessage('flags.template-name.description'),
      exclusive: ['template-id'],
    }),
    label: Flags.string({
      char: 'l',
      summary: messages.getMessage('flags.label.summary'),
      description: messages.getMessage('flags.label.description'),
    }),
    description: Flags.string({
      char: 'd',
      summary: messages.getMessage('flags.description.summary'),
      description: messages.getMessage('flags.description.description'),
    }),
  };

  public async run(): Promise<TemplateData> {
    const { flags } = await this.parse(UpdateTemplate);

    if (!flags['template-id'] && !flags['template-name']) {
      throw new SfError(messages.getMessage('missingRequiredField'), 'MissingRequiredFlag');
    }

    try {
      this.spinner.start(messages.getMessage('fetchingTemplate'));

      type OrgType = { getConnection(apiVersion?: string): Connection };
      const connection = (flags['target-org'] as OrgType).getConnection(flags['api-version']);
      const appFrameworkTemplate = new AppFrameworkTemplate(connection);

      const identifier = flags['template-id'] ?? flags['template-name'];

      this.spinner.stop();
      this.spinner.start(messages.getMessage('updatingTemplate'));

      const updateOptions = {
        label: flags.label,
        description: flags.description,
      };

      const rawTemplate = await appFrameworkTemplate.update(identifier as string, updateOptions);

      this.spinner.stop();

      this.log(messages.getMessage('updateSuccess', [rawTemplate.name, rawTemplate.id]));

      const updatedTemplate = {
        id: rawTemplate.id,
        name: rawTemplate.name,
        label: rawTemplate.label,
        description: rawTemplate.description,
        templateType: rawTemplate.templateType,
        templateSubtype: rawTemplate.templateSubtype,
        templateId: rawTemplate.templateId,
        folderId: rawTemplate.folderId,
        namespace: rawTemplate.namespace,
        templateVersion: rawTemplate.releaseInfo?.templateVersion,
        assetVersion: rawTemplate.assetVersion,
        maxAppCount: rawTemplate.maxAppCount,
        variableDefinition: rawTemplate.variableDefinition,
        layoutDefinition: rawTemplate.layoutDefinition,
        rules: rawTemplate.rules,
        created: rawTemplate.createdDate ? new Date(rawTemplate.createdDate).toLocaleDateString() : 'n/a',
        modified: rawTemplate.lastModifiedDate ? new Date(rawTemplate.lastModifiedDate).toLocaleDateString() : 'n/a',
        industries: rawTemplate.tags?.industries?.join(', ') ?? 'n/a',
        audience: rawTemplate.tags?.targetAudience?.join(', ') ?? 'n/a',
        icons: rawTemplate.icons,
        chainDefinitions: rawTemplate.chainDefinitions,
        applicationSourceId: rawTemplate.applicationSourceId,
        url: rawTemplate.url,
        configurationUrl: rawTemplate.configurationUrl,
        readinessUrl: rawTemplate.readinessUrl,
      };

      TemplateDisplayUtil.displayTemplateDetail(this, updatedTemplate);

      return updatedTemplate;
    } catch (error) {
      this.spinner.stop();
      const errorMsg = (error as Error).message;

      throw new SfError(`Error updating template: ${errorMsg}`, 'TemplateUpdateError');
    }
  }
}
