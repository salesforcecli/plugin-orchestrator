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
import { Messages, SfError } from '@salesforce/core';

import AppFrameworkApp from '../../../utils/app/appframeworkapp.js';

Messages.importMessagesDirectoryFromMetaUrl(import.meta.url);
const messages = Messages.loadMessages('@salesforce/plugin-orchestrator', 'appframework.delete.app');

export default class DeleteApp extends SfCommand<void> {
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
    'no-prompt': Flags.boolean({
      char: 'p',
      summary: messages.getMessage('flags.no-prompt.summary'),
      description: messages.getMessage('flags.no-prompt.description'),
    }),
  };

  public async run(): Promise<void> {
    const { flags } = await this.parse(DeleteApp);

    // Check that at least one of app-id or app-name is provided
    if (!flags['app-id'] && !flags['app-name']) {
      throw new SfError(
        messages.getMessage('noAppSpecified'),
        'AppDeleteError',
        messages.getMessages('error.DeleteError.Actions')
      );
    }

    try {
      const connection = flags['target-org'].getConnection(flags['api-version']);
      const appFrameworkApp = new AppFrameworkApp(connection);

      let appId = '';
      let appName: string | undefined;

      // Get app ID if app name was provided
      if (flags['app-name']) {
        this.spinner.start(messages.getMessage('fetchingApp'));
        const apps = await appFrameworkApp.list();
        const app = apps.find((a) => a.name === flags['app-name']);

        if (!app) {
          this.spinner.stop();
          throw new SfError(
            messages.getMessage('noAppFound'),
            'AppDeleteError',
            messages.getMessages('error.DeleteError.Actions')
          );
        }

        appId = app.id ?? '';
        appName = app.name;
        this.spinner.stop();
      } else {
        appId = flags['app-id'] ?? '';

        // Get app name for confirmation message
        this.spinner.start(messages.getMessage('fetchingApp'));
        const app = await appFrameworkApp.getApp(appId);
        if (app) {
          appName = app.name;
        }
        this.spinner.stop();
      }

      // Confirm deletion unless --no-prompt flag is used
      if (!flags['no-prompt']) {
        const appNameOrId = appName ?? appId;
        const confirmed = await this.confirm({
          message: messages.getMessage('confirmDelete', [appNameOrId]),
        });

        if (!confirmed) {
          this.log(messages.getMessage('deleteCancelled'));
          return;
        }
      }

      // Delete the app
      this.spinner.start(messages.getMessage('deletingApp'));
      await appFrameworkApp.deleteApp(appId);
      this.spinner.stop();

      this.log(messages.getMessage('deleteSuccess', [appId]));
    } catch (error) {
      this.spinner.stop();

      throw new SfError(
        messages.getMessage('error.DeleteError', [(error as Error).message]),
        'AppDeleteError',
        messages.getMessages('error.DeleteError.Actions')
      );
    }
  }
}
