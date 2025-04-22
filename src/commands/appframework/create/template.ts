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
const messages = Messages.loadMessages('@salesforce/plugin-orchestrator', 'appframework.create.template');

export default class CreateTemplate extends SfCommand<string> {
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
    name: Flags.string({
      char: 'n',
      summary: messages.getMessage('flags.name.summary'),
      description: messages.getMessage('flags.name.description'),
      required: true,
    }),
    type: Flags.string({
      char: 't',
      summary: messages.getMessage('flags.type.summary'),
      description: messages.getMessage('flags.type.description'),
      default: 'app',
      options: ['app', 'component', 'dashboard', 'lens'],
    }),
    subtype: Flags.string({
      char: 's',
      summary: messages.getMessage('flags.subtype.summary'),
      description: messages.getMessage('flags.subtype.description'),
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

  public async run(): Promise<string> {
    const { flags } = await this.parse(CreateTemplate);

    this.spinner.start(messages.getMessage('creatingTemplate'));

    try {
      type OrgType = { getConnection(apiVersion?: string): Connection };
      const connection = (flags['target-org'] as OrgType).getConnection(flags['api-version']);
      const appFrameworkTemplate = new AppFrameworkTemplate(connection);

      const templateId = await appFrameworkTemplate.create({
        name: flags.name,
        templateType: flags.type,
        templateSubtype: flags.subtype,
        label: flags.label,
        description: flags.description,
      });

      this.spinner.stop();

      this.log(messages.getMessage('createSuccess', [templateId]));

      try {
        const template = await appFrameworkTemplate.getTemplate(templateId);
        if (template) {
          const displayTemplate: TemplateData = {
            ...template,
          };
          TemplateDisplayUtil.displayTemplateDetail(this, displayTemplate);
        }
      } catch (error) {
        this.debug(`Error fetching template details: ${(error as Error).message}`);
      }

      return templateId;
    } catch (error) {
      this.spinner.stop();

      throw new SfError(`Error creating AppFramework template: ${(error as Error).message}`, 'TemplateCreationError', [
        'Verify that you have permission to create templates',
        'Ensure you are connected to the correct org',
        'Check your API version compatibility',
      ]);
    }
  }
}
