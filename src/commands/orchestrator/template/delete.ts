/*
 * Copyright (c) 2025, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { Flags, SfCommand } from '@salesforce/sf-plugins-core';
import { Messages, SfError, Connection } from '@salesforce/core';

import AppFrameworkTemplate from '../../../utils/template/appframeworktemplate.js';

Messages.importMessagesDirectoryFromMetaUrl(import.meta.url);
const messages = Messages.loadMessages('@salesforce/plugin-orchestrator', 'appframework.template.delete');

export default class Delete extends SfCommand<void> {
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
    'no-prompt': Flags.boolean({
      char: 'p',
      summary: messages.getMessage('flags.no-prompt.summary'),
      description: messages.getMessage('flags.no-prompt.description'),
    }),
  };

  // we'll add this after template app delete is in place
  // 'force-delete': Flags.boolean({
  //   char: 'f',
  //   summary: messages.getMessage('flags.force-delete.summary'),
  //   description: messages.getMessage('flags.force-delete.description'),
  // }),

  public async run(): Promise<void> {
    const { flags } = await this.parse(Delete);

    if (!flags['template-id'] && !flags['template-name']) {
      throw new SfError(
        messages.getMessage('error.MissingRequiredFlag'),
        'MissingRequiredFlag',
        messages.getMessages('error.MissingRequiredFlag.Actions')
      );
    }

    try {
      type OrgType = { getConnection(apiVersion?: string): Connection };
      const connection = (flags['target-org'] as OrgType).getConnection(flags['api-version']);
      const appFrameworkTemplate = new AppFrameworkTemplate(connection);

      const identifier = flags['template-id'] ?? flags['template-name'] ?? '';

      this.spinner.start(messages.getMessage('fetchingTemplate'));

      const template = await appFrameworkTemplate.getTemplate(String(identifier));

      this.spinner.stop();

      if (!template) {
        throw new SfError(
          messages.getMessage('error.TemplateNotFound', [String(identifier)]),
          'TemplateNotFound',
          messages.getMessages('error.TemplateNotFound.Actions')
        );
      }

      let shouldDelete = flags['no-prompt'];
      if (!shouldDelete) {
        shouldDelete = await this.confirm({
          message: 'confirmDeleteYesNo',
        });
      }

      if (!shouldDelete) {
        this.log(messages.getMessage('deletionCancelled'));
        return;
      }

      // if (flags['force-delete']) {
      //   this.spinner.start(messages.getMessage('deletingApps'));

      //   // TODO: This is a placeholder. In a full implementation, we would:
      //   // 1. Find all apps created from this template
      //   // 2. Delete each app

      //   this.spinner.stop();
      //   this.log('Force delete of apps is not currently implemented. Only the template will be deleted.');
      // }

      this.spinner.start(messages.getMessage('deletingTemplate'));
      await appFrameworkTemplate.deleteTemplate(template.id);
      this.spinner.stop();

      this.log(messages.getMessage('deleteTemplateSuccess', [template.id]));
    } catch (error) {
      this.spinner.stop();
      const errorMsg = (error as Error).message;

      if (errorMsg.includes('certificate') || errorMsg.includes('altnames')) {
        throw new SfError(
          messages.getMessage('error.CertificateError'),
          'TemplateDeletionError',
          messages.getMessages('error.CertificateError.Actions')
        );
      } else if (errorMsg.includes('Unauthorized') || errorMsg.includes('401')) {
        throw new SfError(
          messages.getMessage('error.AuthenticationError'),
          'TemplateDeletionError',
          messages.getMessages('error.AuthenticationError.Actions')
        );
      } else if (errorMsg.includes('Not Found') || errorMsg.includes('404')) {
        const identifier = String(flags['template-id'] ?? flags['template-name'] ?? '');
        throw new SfError(
          messages.getMessage('error.TemplateNotFound', [identifier]),
          'TemplateDeletionError',
          messages.getMessages('error.TemplateNotFound.Actions')
        );
      } else {
        throw new SfError(
          messages.getMessage('error.GenericError', [errorMsg]),
          'TemplateDeletionError',
          messages.getMessages('error.GenericError.Actions')
        );
      }
    }
  }
}
