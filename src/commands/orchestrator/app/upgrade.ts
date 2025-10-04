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
import { SfCommand, Flags } from '@salesforce/sf-plugins-core';
import { Messages, SfError, Connection } from '@salesforce/core';
import AppFrameworkApp from '../../../utils/app/appframeworkapp.js';
import { AppListUtil } from '../../../utils/app/appListUtils.js';
import { AppDisplayUtil } from '../../../utils/app/appDisplayUtil.js';

Messages.importMessagesDirectoryFromMetaUrl(import.meta.url);
const messages = Messages.loadMessages('@salesforce/plugin-orchestrator', 'orchestrator.app.upgrade');

export type OrchestratorAppUpgradeResult = {
  appId: string;
};

export default class OrchestratorAppUpgrade extends SfCommand<OrchestratorAppUpgradeResult> {
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
      required: true,
    }),
    'template-values': Flags.string({
      char: 'v',
      summary: messages.getMessage('flags.template-values.summary'),
      description: messages.getMessage('flags.template-values.description'),
    }),
    'runtime-method': Flags.string({
      char: 'r',
      summary: messages.getMessage('flags.runtime-method.summary'),
      description: messages.getMessage('flags.runtime-method.description'),
      options: ['sync', 'async'],
    }),
    'log-level': Flags.string({
      char: 'l',
      summary: messages.getMessage('flags.log-level.summary'),
      description: messages.getMessage('flags.log-level.description'),
      options: ['debug', 'info', 'warn', 'error'],
    }),
    'chain-name': Flags.string({
      char: 'c',
      summary: messages.getMessage('flags.chain-name.summary'),
      description: messages.getMessage('flags.chain-name.description'),
    }),
  };

  public async run(): Promise<OrchestratorAppUpgradeResult> {
    const { flags } = await this.parse(OrchestratorAppUpgrade);

    // Check that at least one of app-id or app-name is provided
    if (!flags['app-id'] && !flags['app-name']) {
      throw new SfError(
        messages.getMessage('noAppSpecified'),
        'AppUpgradeError',
        messages.getMessages('error.UpgradeError.Actions')
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
            'AppUpgradeError',
            messages.getMessages('error.UpgradeError.Actions')
          );
        }

        appId = app.id ?? '';
        this.spinner.stop();
      } else {
        appId = flags['app-id'] ?? '';
      }

      // Parse template values if provided
      let templateValues: Record<string, unknown> | undefined;
      if (flags['template-values']) {
        try {
          templateValues = JSON.parse(flags['template-values']) as Record<string, unknown>;
        } catch (error) {
          throw new SfError(
            messages.getMessage('invalidTemplateValues'),
            'AppUpgradeError',
            messages.getMessages('error.UpgradeError.Actions')
          );
        }
      }

      // Upgrade the app
      this.spinner.start(messages.getMessage('upgradingApp'));

      // Build the update options, only including chainName if it was provided
      const updateOptions: {
        templateSourceId: string;
        templateValues?: Record<string, unknown>;
        runtimeMethod?: string;
        logLevel?: string;
        chainName?: string;
      } = {
        templateSourceId: flags['template-id'],
        templateValues,
        runtimeMethod: flags['runtime-method'],
        logLevel: flags['log-level'],
      };

      // Only include chainName if it was explicitly provided
      if (flags['chain-name']) {
        updateOptions.chainName = flags['chain-name'];
      }

      const upgradedAppId = await appFrameworkApp.updateApp(appId, updateOptions);

      this.spinner.stop();

      this.log(messages.getMessage('upgradeSuccess', [upgradedAppId]));

      // Fetch the upgraded app and display its details
      const upgradedApp = await appFrameworkApp.getApp(upgradedAppId);
      if (upgradedApp) {
        const processedApps = AppListUtil.processApps([upgradedApp]);
        if (processedApps.length > 0) {
          AppDisplayUtil.displayAppDetails(this, processedApps[0]);
        }
      }

      return {
        appId: upgradedAppId,
      };
    } catch (error) {
      this.spinner.stop();

      throw new SfError(
        messages.getMessage('error.UpgradeError', [(error as Error).message]),
        'AppUpgradeError',
        messages.getMessages('error.UpgradeError.Actions')
      );
    }
  }
}
