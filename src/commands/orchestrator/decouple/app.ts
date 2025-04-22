/*
 * Copyright (c) 2025, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { Flags, SfCommand } from '@salesforce/sf-plugins-core';
import { Messages, SfError, Connection } from '@salesforce/core';

import AppFrameworkApp from '../../../utils/app/appframeworkapp.js';
import { AppListUtil } from '../../../utils/app/appListUtils.js';
import { AppDisplayUtil } from '../../../utils/app/appDisplayUtil.js';

Messages.importMessagesDirectoryFromMetaUrl(import.meta.url);
const messages = Messages.loadMessages('@salesforce/plugin-orchestrator', 'appframework.decouple.app');

export default class DecoupleApp extends SfCommand<string> {
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

  public async run(): Promise<string> {
    const { flags } = await this.parse(DecoupleApp);

    // Check that at least one of app-id or app-name is provided
    if (!flags['app-id'] && !flags['app-name']) {
      throw new SfError(
        messages.getMessage('noAppSpecified'),
        'AppDecoupleError',
        messages.getMessages('error.DecoupleError.Actions')
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
            'AppDecoupleError',
            messages.getMessages('error.DecoupleError.Actions')
          );
        }

        appId = app.id ?? '';
        this.spinner.stop();
      } else {
        appId = flags['app-id'] ?? '';
      }

      // Get the app to retrieve its template
      this.spinner.start(messages.getMessage('fetchingApp'));
      const app = await appFrameworkApp.getApp(appId);

      if (!app) {
        this.spinner.stop();
        throw new SfError(
          messages.getMessage('noAppFound'),
          'AppDecoupleError',
          messages.getMessages('error.DecoupleError.Actions')
        );
      }

      if (!app.templateSourceId) {
        this.spinner.stop();
        throw new SfError(
          messages.getMessage('noTemplateFound'),
          'AppDecoupleError',
          messages.getMessages('error.DecoupleError.Actions')
        );
      }

      const templateId = app.templateSourceId;
      this.spinner.stop();

      // Decouple the app
      this.spinner.start(messages.getMessage('decouplingApp'));

      const decoupledAppId = await appFrameworkApp.decoupleApp(appId, templateId);

      this.spinner.stop();

      this.log(messages.getMessage('decoupleSuccess', [decoupledAppId]));

      try {
        // Fetch the updated app and display its details
        const updatedApp = await appFrameworkApp.getApp(decoupledAppId);
        if (updatedApp) {
          const processedApps = AppListUtil.processApps([updatedApp]);
          if (processedApps.length > 0) {
            AppDisplayUtil.displayAppDetails(this, processedApps[0]);
          }
        }
      } catch (error) {
        this.debug(`Error fetching decoupled app details: ${(error as Error).message}`);
      }

      return decoupledAppId;
    } catch (error) {
      this.spinner.stop();

      throw new SfError(
        messages.getMessage('error.DecoupleError', [(error as Error).message]),
        'AppDecoupleError',
        messages.getMessages('error.DecoupleError.Actions')
      );
    }
  }
}
