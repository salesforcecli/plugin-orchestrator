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
import { AppListUtil } from '../../../utils/app/appListUtils.js';
import { AppDisplayUtil } from '../../../utils/app/appDisplayUtil.js';

Messages.importMessagesDirectoryFromMetaUrl(import.meta.url);
const messages = Messages.loadMessages('@salesforce/plugin-orchestrator', 'appframework.update.app');

export default class UpdateApp extends SfCommand<string> {
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
    'app-id': Flags.string({
      char: 'i',
      summary: messages.getMessage('flags.app-id.summary'),
      description: messages.getMessage('flags.app-id.description'),
      exclusive: ['app-name'],
    }),
    'app-name': Flags.string({
      char: 'n',
      summary: messages.getMessage('flags.app-name.summary'),
      description: messages.getMessage('flags.app-name.description'),
      exclusive: ['app-id'],
    }),
    'template-id': Flags.string({
      char: 't',
      summary: messages.getMessage('flags.template-id.summary'),
      description: messages.getMessage('flags.template-id.description'),
      exclusive: ['template-name'],
    }),
    'template-name': Flags.string({
      char: 'm',
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
    const { flags } = await this.parse(UpdateApp);

    // Check that at least one of app-id or app-name is provided
    if (!flags['app-id'] && !flags['app-name']) {
      throw new SfError(
        messages.getMessage('noAppSpecified'),
        'AppUpdateError',
        messages.getMessages('error.UpdateError.Actions')
      );
    }

    // Check that at least one of template-id or template-name is provided
    if (!flags['template-id'] && !flags['template-name']) {
      throw new SfError(
        messages.getMessage('noTemplateSpecified'),
        'AppUpdateError',
        messages.getMessages('error.UpdateError.Actions')
      );
    }

    try {
      type OrgType = { getConnection(apiVersion?: string): Connection };
      const connection = (flags['target-org'] as OrgType).getConnection(flags['api-version']);

      const appFrameworkApp = new AppFrameworkApp(connection);

      let appId = '';

      // Get app ID if app name was provided
      if (flags['app-name']) {
        this.spinner.start(messages.getMessage('fetchingApp'));
        const apps = await appFrameworkApp.list();
        const app = apps.find((a) => a.name === flags['app-name']);

        if (!app) {
          this.spinner.stop();
          throw new SfError(
            messages.getMessage('noAppFound'),
            'AppUpdateError',
            messages.getMessages('error.UpdateError.Actions')
          );
        }

        appId = app.id ?? '';
        this.spinner.stop();
      } else {
        appId = flags['app-id'] ?? '';
      }

      let templateId = '';

      // Get template ID if template name was provided
      if (flags['template-name']) {
        this.spinner.start(messages.getMessage('fetchingTemplate'));

        // Since we don't have a direct way to list templates,
        // we need to get the template by name from a different utility class
        // For now, we'll throw an error and suggest using template-id instead
        this.spinner.stop();
        throw new SfError(
          messages.getMessage('noTemplateFound'),
          'AppUpdateError',
          messages.getMessages('error.UpdateError.Actions')
        );
      } else {
        templateId = flags['template-id'] ?? '';
      }

      // Update the app
      this.spinner.start(messages.getMessage('updatingApp'));

      const updatedAppId = await appFrameworkApp.updateApp(appId, {
        templateSourceId: templateId,
        label: flags.label,
        description: flags.description,
        runtimeMethod: flags['runtime-method'],
        logLevel: flags['log-level'],
      });

      this.spinner.stop();

      this.log(messages.getMessage('updateSuccess', [updatedAppId]));

      // Fetch the updated app and display its details
      const updatedApp = await appFrameworkApp.getApp(updatedAppId);
      if (updatedApp) {
        const processedApps = AppListUtil.processApps([updatedApp]);
        if (processedApps.length > 0) {
          AppDisplayUtil.displayAppDetails(this, processedApps[0]);
        }
      }

      return updatedAppId;
    } catch (error) {
      this.spinner.stop();

      throw new SfError(
        messages.getMessage('error.UpdateError', [(error as Error).message]),
        'AppUpdateError',
        messages.getMessages('error.UpdateError.Actions')
      );
    }
  }
}
