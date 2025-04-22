/*
 * Copyright (c) 2025, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
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
