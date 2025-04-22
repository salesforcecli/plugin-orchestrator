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
import { AppListUtil } from '../../../utils/app/appListUtils.js';
import { AppDisplayUtil } from '../../../utils/app/appDisplayUtil.js';

Messages.importMessagesDirectoryFromMetaUrl(import.meta.url);
const messages = Messages.loadMessages('@salesforce/plugin-orchestrator', 'appframework.list.app');

export default class ListApp extends SfCommand<AppData[]> {
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
  };

  public async run(): Promise<AppData[]> {
    const { flags } = await this.parse(ListApp);

    try {
      this.spinner.start(messages.getMessage('fetchingApps'));

      type OrgType = { getConnection(apiVersion?: string): Connection };

      const connection = (flags['target-org'] as OrgType).getConnection(flags['api-version']);
      const appFrameworkApp = new AppFrameworkApp(connection);
      const rawApps = await appFrameworkApp.list();
      this.spinner.stop();

      const apps = AppListUtil.processApps(rawApps);

      if (apps.length > 0) {
        AppDisplayUtil.displayAppList(this, apps);
      } else {
        this.log(messages.getMessage('noAppsFound'));
      }

      return apps;
    } catch (error) {
      this.spinner.stop();
      const errorMsg = (error as Error).message;

      if (errorMsg.includes('certificate') || errorMsg.includes('altnames')) {
        throw new SfError(
          messages.getMessage('error.CertificateError'),
          'AppListError',
          messages.getMessages('error.CertificateError.Actions')
        );
      } else if (errorMsg.includes('Unauthorized') || errorMsg.includes('401')) {
        throw new SfError(
          messages.getMessage('error.AuthenticationError'),
          'AppListError',
          messages.getMessages('error.AuthenticationError.Actions')
        );
      } else {
        throw new SfError(
          messages.getMessage('error.GenericError', [errorMsg]),
          'AppListError',
          messages.getMessages('error.GenericError.Actions')
        );
      }
    }
  }
}
