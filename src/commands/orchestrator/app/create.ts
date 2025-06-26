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

import AppFrameworkApp from '../../../utils/app/appframeworkapp.js';
import AppFrameworkTemplate from '../../../utils/template/appframeworktemplate.js';
import { AppData } from '../../../utils/app/appTypes.js';
import { AppDisplayUtil } from '../../../utils/app/appDisplayUtil.js';

Messages.importMessagesDirectoryFromMetaUrl(import.meta.url);
const messages = Messages.loadMessages('@salesforce/plugin-orchestrator', 'appframework.create.app');

export default class CreateApp extends SfCommand<string> {
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
    'template-id': Flags.string({
      char: 'i',
      summary: messages.getMessage('flags.template-id.summary'),
      description: messages.getMessage('flags.template-id.description'),
      exclusive: ['template-name'],
    }),
    'template-name': Flags.string({
      char: 't',
      summary: messages.getMessage('flags.template-name.summary'),
      description: messages.getMessage('flags.template-name.description'),
      exclusive: ['template-id'],
    }),
    'runtime-method': Flags.string({
      char: 'r',
      summary: messages.getMessage('flags.runtime-method.summary'),
      description: messages.getMessage('flags.runtime-method.description'),
      options: ['sync', 'async'],
    }),
    'log-level': Flags.string({
      char: 'g',
      summary: messages.getMessage('flags.log-level.summary'),
      description: messages.getMessage('flags.log-level.description'),
      options: ['debug', 'info', 'warn', 'error'],
    }),
  };

  public async run(): Promise<string> {
    const { flags } = await this.parse(CreateApp);

    // Check that at least one of template-id or template-name is provided
    if (!flags['template-id'] && !flags['template-name']) {
      throw new SfError(
        messages.getMessage('noTemplateSpecified'),
        'AppCreationError',
        messages.getMessages('error.AppCreationError.Actions')
      );
    }

    try {
      type OrgType = { getConnection(apiVersion?: string): Connection };
      const connection = (flags['target-org'] as OrgType).getConnection(flags['api-version']);
      const appFrameworkApp = new AppFrameworkApp(connection);
      const appFrameworkTemplate = new AppFrameworkTemplate(connection);

      let templateId = flags['template-id'];

      // If template name is provided instead of ID, look up the ID
      if (flags['template-name']) {
        this.spinner.start(messages.getMessage('fetchingTemplate'));
        const templates = await appFrameworkTemplate.list();
        const template = templates.find((t) => t.name === flags['template-name']);

        if (!template) {
          this.spinner.stop();
          throw new SfError(
            messages.getMessage('error.TemplateNotFound'),
            'TemplateNotFound',
            messages.getMessages('error.TemplateNotFound.Actions')
          );
        }

        templateId = template.id;
        this.spinner.stop();
      }

      this.spinner.start(messages.getMessage('creatingApp'));

      const appId = await appFrameworkApp.create({
        name: flags.name,
        label: flags.label,
        description: flags.description,
        templateSourceId: templateId!,
        runtimeMethod: flags['runtime-method'],
        logLevel: flags['log-level'],
      });

      this.spinner.stop();

      this.log(messages.getMessage('createSuccess', [appId]));

      try {
        // Fetch the created app and display its details
        const app = await appFrameworkApp.getApp(appId);
        if (app) {
          const displayApp: AppData = {
            id: app.id,
            name: app.name,
            label: app.label,
            description: app.description,
            templateSourceId: app.templateSourceId,
            templateType: app.templateType,
            templateSubtype: app.templateSubtype,
            templateVersion: app.templateVersion,
            namespace: app.namespace,
            created: app.createdDate ? new Date(app.createdDate).toLocaleDateString() : undefined,
            modified: app.lastModifiedDate ? new Date(app.lastModifiedDate).toLocaleDateString() : undefined,
            runtimeMethod: app.runtimeMethod,
            logLevel: app.logLevel,
            status: app.status,
            url: app.url,
            configurationUrl: app.configurationUrl,
            readinessUrl: app.readinessUrl,
          };
          AppDisplayUtil.displayAppDetails(this, displayApp);
        }
      } catch (error) {
        this.debug(`Error fetching app details: ${(error as Error).message}`);
      }

      return appId;
    } catch (error) {
      this.spinner.stop();

      if ((error as SfError).name === 'TemplateNotFound') {
        throw error;
      }

      throw new SfError(
        messages.getMessage('error.AppCreationError', [(error as Error).message]),
        'AppCreationError',
        messages.getMessages('error.AppCreationError.Actions')
      );
    }
  }
}
