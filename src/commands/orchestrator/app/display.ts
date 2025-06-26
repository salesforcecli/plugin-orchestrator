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
import { AppData } from '../../../utils/app/appTypes.js';
import { AppDisplayUtil } from '../../../utils/app/appDisplayUtil.js';

Messages.importMessagesDirectoryFromMetaUrl(import.meta.url);
const messages = Messages.loadMessages('@salesforce/plugin-orchestrator', 'appframework.display.app');

export default class DisplayApp extends SfCommand<AppData | undefined> {
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
  };

  public async run(): Promise<AppData | undefined> {
    const { flags } = await this.parse(DisplayApp);

    if (!flags['app-id'] && !flags['app-name']) {
      throw new SfError(
        messages.getMessage('noAppSpecified'),
        'AppDisplayError',
        messages.getMessages('error.RetrievalError.Actions')
      );
    }

    const idOrName = flags['app-id'] ?? flags['app-name'] ?? '';

    this.spinner.start(messages.getMessage('fetchingApp'));

    try {
      type OrgType = { getConnection(apiVersion?: string): Connection };
      const connection = (flags['target-org'] as OrgType).getConnection(flags['api-version']);
      const appFrameworkApp = new AppFrameworkApp(connection);

      const app = await appFrameworkApp.getApp(idOrName);
      this.spinner.stop();

      if (!app) {
        this.log(messages.getMessage('noAppFound'));
        return undefined;
      }

      const appData: AppData = {
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

      AppDisplayUtil.displayAppDetails(this, appData);
      return appData;
    } catch (error) {
      this.spinner.stop();

      throw new SfError(
        messages.getMessage('error.RetrievalError', [(error as Error).message]),
        'AppDisplayError',
        messages.getMessages('error.RetrievalError.Actions')
      );
    }
  }
}
