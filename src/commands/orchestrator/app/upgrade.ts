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
import { RawApp } from '../../../utils/app/appTypes.js';

Messages.importMessagesDirectoryFromMetaUrl(import.meta.url);
const messages = Messages.loadMessages('@salesforce/plugin-orchestrator', 'orchestrator.app.upgrade');

export type OrchestratorAppUpgradeResult = {
  appId: string;
};

type UpdateOptions = {
  templateSourceId: string;
  templateValues?: Record<string, unknown>;
  runtimeMethod?: string;
  logLevel?: string;
  chainName?: string;
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

  private static validateRequiredFlags(flags: Record<string, unknown>): void {
    if (!flags['app-id'] && !flags['app-name']) {
      throw new SfError(
        messages.getMessage('noAppSpecified'),
        'AppUpgradeError',
        messages.getMessages('error.UpgradeError.Actions')
      );
    }
  }

  private static validateTemplateMatch(app: RawApp, templateId: string): void {
    if (app.templateSourceId !== templateId) {
      throw new SfError(
        `Template ID mismatch. App is using template '${
          app.templateSourceId ?? 'unknown'
        }' but you specified '${templateId}'. You cannot change the underlying template during an upgrade.`,
        'AppUpgradeError',
        messages.getMessages('error.UpgradeError.Actions')
      );
    }
  }

  private static parseTemplateValues(templateValuesString?: string): Record<string, unknown> | undefined {
    if (!templateValuesString) {
      return undefined;
    }

    try {
      const parsed: unknown = JSON.parse(templateValuesString);
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        throw new SfError(
          'Template values must be a valid JSON object, not an array or primitive value.',
          'AppUpgradeError',
          messages.getMessages('error.UpgradeError.Actions')
        );
      }

      return parsed as Record<string, unknown>;
    } catch (error) {
      if (error instanceof SfError) {
        throw error;
      }
      throw new SfError(
        messages.getMessage('invalidTemplateValues'),
        'AppUpgradeError',
        messages.getMessages('error.UpgradeError.Actions')
      );
    }
  }

  private static buildUpdateOptions(
    flags: Record<string, unknown>,
    templateValues?: Record<string, unknown>
  ): UpdateOptions {
    const updateOptions: UpdateOptions = {
      templateSourceId: flags['template-id'] as string,
      templateValues,
      runtimeMethod: flags['runtime-method'] as string | undefined,
      logLevel: flags['log-level'] as string | undefined,
    };

    if (flags['chain-name']) {
      updateOptions.chainName = flags['chain-name'] as string;
    }

    return updateOptions;
  }

  private static async resolveAppById(
    appId: string,
    appFrameworkApp: AppFrameworkApp
  ): Promise<{ appId: string; app: RawApp }> {
    if (!appId) {
      throw new SfError(
        messages.getMessage('noAppSpecified'),
        'AppUpgradeError',
        messages.getMessages('error.UpgradeError.Actions')
      );
    }

    const app = await appFrameworkApp.getApp(appId);
    if (!app) {
      throw new SfError(
        messages.getMessage('noAppFound'),
        'AppUpgradeError',
        messages.getMessages('error.UpgradeError.Actions')
      );
    }

    return { appId, app };
  }

  private static handleUpgradeError(error: unknown): never {
    if (error instanceof SfError) {
      throw error;
    }

    throw new SfError(
      messages.getMessage('error.UpgradeError', [(error as Error).message]),
      'AppUpgradeError',
      messages.getMessages('error.UpgradeError.Actions'),
      undefined,
      error as Error
    );
  }

  public async run(): Promise<OrchestratorAppUpgradeResult> {
    const { flags } = await this.parse(OrchestratorAppUpgrade);

    OrchestratorAppUpgrade.validateRequiredFlags(flags);

    try {
      type OrgType = { getConnection(apiVersion?: string): Connection };
      const connection = (flags['target-org'] as OrgType).getConnection(flags['api-version']);
      const appFrameworkApp = new AppFrameworkApp(connection);

      const { appId, app } = await this.resolveApp(flags, appFrameworkApp);
      OrchestratorAppUpgrade.validateTemplateMatch(app, flags['template-id']);
      const templateValues = OrchestratorAppUpgrade.parseTemplateValues(flags['template-values']);
      const updateOptions = OrchestratorAppUpgrade.buildUpdateOptions(flags, templateValues);

      const upgradedAppId = await this.executeUpgrade(appFrameworkApp, appId, updateOptions);
      await this.displayUpgradedApp(appFrameworkApp, upgradedAppId);

      return { appId: upgradedAppId };
    } catch (error) {
      this.spinner.stop();
      OrchestratorAppUpgrade.handleUpgradeError(error);
    }
  }

  private async resolveApp(
    flags: Record<string, unknown>,
    appFrameworkApp: AppFrameworkApp
  ): Promise<{ appId: string; app: RawApp }> {
    if (flags['app-name']) {
      return this.resolveAppByName(flags['app-name'] as string, appFrameworkApp);
    }
    return OrchestratorAppUpgrade.resolveAppById(flags['app-id'] as string, appFrameworkApp);
  }

  private async resolveAppByName(
    appName: string,
    appFrameworkApp: AppFrameworkApp
  ): Promise<{ appId: string; app: RawApp }> {
    this.spinner.start(messages.getMessage('fetchingApp'));
    const apps = await appFrameworkApp.list();
    const foundApp = apps.find((a) => a.name === appName);

    if (!foundApp?.id) {
      this.spinner.stop();
      throw new SfError(
        messages.getMessage('noAppFound'),
        'AppUpgradeError',
        messages.getMessages('error.UpgradeError.Actions')
      );
    }

    this.spinner.stop();
    return { appId: foundApp.id, app: foundApp };
  }

  private async executeUpgrade(
    appFrameworkApp: AppFrameworkApp,
    appId: string,
    updateOptions: UpdateOptions
  ): Promise<string> {
    this.spinner.start(messages.getMessage('upgradingApp'));
    const upgradedAppId = await appFrameworkApp.updateApp(appId, updateOptions);
    this.spinner.stop();
    this.log(messages.getMessage('upgradeSuccess', [upgradedAppId]));
    return upgradedAppId;
  }

  private async displayUpgradedApp(appFrameworkApp: AppFrameworkApp, upgradedAppId: string): Promise<void> {
    const upgradedApp = await appFrameworkApp.getApp(upgradedAppId);
    if (upgradedApp) {
      const processedApps = AppListUtil.processApps([upgradedApp]);
      if (processedApps.length > 0) {
        AppDisplayUtil.displayAppDetails(this, processedApps[0]);
      }
    }
  }
}
