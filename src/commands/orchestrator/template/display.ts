/*
 * Copyright (c) 2025, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { Flags, SfCommand } from '@salesforce/sf-plugins-core';
import { Messages, SfError, Connection } from '@salesforce/core';

import AppFrameworkTemplate from '../../../utils/template/appframeworktemplate.js';
import { TemplateData } from '../../../utils/template/templateTypes.js';
import { TemplateDisplayUtil } from '../../../utils/template/templateDisplayUtil.js';

Messages.importMessagesDirectoryFromMetaUrl(import.meta.url);
const messages = Messages.loadMessages('@salesforce/plugin-orchestrator', 'appframework.template.display');

export default class Display extends SfCommand<TemplateData> {
  public static readonly summary = messages.getMessage('summary');
  public static readonly description = messages.getMessage('description');
  public static readonly examples = messages.getMessages('examples');
  public static readonly state = 'preview';

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
  };

  public async run(): Promise<TemplateData> {
    const { flags } = await this.parse(Display);

    if (!flags['template-id'] && !flags['template-name']) {
      throw new SfError(
        messages.getMessage('error.MissingRequiredFlag'),
        'MissingRequiredFlag',
        messages.getMessages('error.MissingRequiredFlag.Actions')
      );
    }

    try {
      this.spinner.start(messages.getMessage('fetchingTemplate'));

      type OrgType = { getConnection(apiVersion?: string): Connection };
      const connection = (flags['target-org'] as OrgType).getConnection(flags['api-version']);
      const appFrameworkTemplate = new AppFrameworkTemplate(connection);

      const identifier = flags['template-id'] ?? flags['template-name'];
      const rawTemplate = await appFrameworkTemplate.getTemplate(identifier as string);

      if (!rawTemplate) {
        throw new SfError(`Template ${String(identifier)} not found, 'TemplateNotFound'`);
      }

      const template = {
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
        created: rawTemplate.createdDate ? new Date(rawTemplate.createdDate).toLocaleString() : 'n/a',
        modified: rawTemplate.lastModifiedDate ? new Date(rawTemplate.lastModifiedDate).toLocaleString() : 'n/a',
        industries: rawTemplate.tags?.industries?.join(', ') ?? 'n/a',
        audience: rawTemplate.tags?.targetAudience?.join(', ') ?? 'n/a',
        icons: rawTemplate.icons,
        chainDefinitions: rawTemplate.chainDefinitions,
        applicationSourceId: rawTemplate.applicationSourceId,
        url: rawTemplate.url,
        configurationUrl: rawTemplate.configurationUrl,
        readinessUrl: rawTemplate.readinessUrl,
      };

      this.spinner.stop();

      TemplateDisplayUtil.displayTemplateDetail(this, template);

      return template;
    } catch (error) {
      this.spinner.stop();
      const errorMsg = (error as Error).message;

      if (errorMsg.includes('certificate') || errorMsg.includes('altnames')) {
        throw new SfError(
          messages.getMessage('error.CertificateError'),
          'TemplateDisplayError',
          messages.getMessages('error.CertificateError.Actions')
        );
      } else if (errorMsg.includes('Unauthorized') || errorMsg.includes('401')) {
        throw new SfError(
          messages.getMessage('error.AuthenticationError'),
          'TemplateDisplayError',
          messages.getMessages('error.AuthenticationError.Actions')
        );
      } else if (errorMsg.includes('Not Found') || errorMsg.includes('404')) {
        const identifier = String(flags['template-id'] ?? flags['template-name'] ?? '');
        throw new SfError(
          messages.getMessage('error.TemplateNotFound', [identifier]),
          'TemplateDisplayError',
          messages.getMessages('error.TemplateNotFound.Actions')
        );
      } else {
        throw new SfError(
          messages.getMessage('error.GenericError', [errorMsg]),
          'TemplateDisplayError',
          messages.getMessages('error.GenericError.Actions')
        );
      }
    }
  }
}
