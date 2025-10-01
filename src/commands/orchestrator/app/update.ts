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
    const { flags } = await this.parse(UpdateApp);

    // Check that at least one of app-id or app-name is provided
    if (!flags['app-id'] && !flags['app-name']) {
      throw new SfError(
        messages.getMessage('noAppSpecified'),
        'AppUpdateError',
        messages.getMessages('error.UpdateError.Actions')
      );
    }

    // Check that at least one update field is provided
    if (!flags.label && !flags.description) {
      throw new SfError(
        messages.getMessage('noUpdateFieldsSpecified'),
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

      // Update the app
      this.spinner.start(messages.getMessage('updatingApp'));

      const updatedAppId = await appFrameworkApp.patchApp(appId, {
        label: flags.label,
        description: flags.description,
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
