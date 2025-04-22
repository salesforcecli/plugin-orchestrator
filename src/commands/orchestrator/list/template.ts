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
import { TemplateListUtil } from '../../../utils/template/templateListUtils.js';
import { TemplateDisplayUtil } from '../../../utils/template/templateDisplayUtil.js';

Messages.importMessagesDirectoryFromMetaUrl(import.meta.url);
const messages = Messages.loadMessages('@salesforce/plugin-orchestrator', 'appframework.list.template');

export default class ListTemplate extends SfCommand<TemplateData[]> {
  public static readonly summary = messages.getMessage('summary');
  public static readonly description = messages.getMessage('description');
  public static readonly examples = messages.getMessages('examples');
  public static readonly state = 'preview';

  // Add alias for backward compatibility
  public static readonly aliases = ['orchestrator template list'];

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
  };

  public async run(): Promise<TemplateData[]> {
    const { flags } = await this.parse(ListTemplate);

    try {
      this.spinner.start(messages.getMessage('fetchingTemplates'));

      type OrgType = { getConnection(apiVersion?: string): Connection };

      const connection = (flags['target-org'] as OrgType).getConnection(flags['api-version']);
      const appFrameworkTemplate = new AppFrameworkTemplate(connection);
      const rawTemplates = await appFrameworkTemplate.list();
      this.spinner.stop();

      const templates = TemplateListUtil.processTemplates(rawTemplates);

      if (templates.length > 0) {
        TemplateDisplayUtil.displayTemplateList(this, templates);
      } else {
        this.log(messages.getMessage('noResultsFound'));
      }

      return templates;
    } catch (error) {
      this.spinner.stop();
      const errorMsg = (error as Error).message;

      if (errorMsg.includes('certificate') || errorMsg.includes('altnames')) {
        throw new SfError(
          messages.getMessage('error.CertificateError'),
          'TemplateListError',
          messages.getMessages('error.CertificateError.Actions')
        );
      } else if (errorMsg.includes('Unauthorized') || errorMsg.includes('401')) {
        throw new SfError(
          messages.getMessage('error.AuthenticationError'),
          'TemplateListError',
          messages.getMessages('error.AuthenticationError.Actions')
        );
      } else {
        throw new SfError(
          messages.getMessage('error.GenericError', [errorMsg]),
          'TemplateListError',
          messages.getMessages('error.GenericError.Actions')
        );
      }
    }
  }
}
