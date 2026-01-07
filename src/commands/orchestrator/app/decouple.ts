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
      default: '65.0',
    }),
    'app-id': Flags.string({
      char: 'i',
      summary: messages.getMessage('flags.app-id.summary'),
      description: messages.getMessage('flags.app-id.description'),
      required: true,
    }),
  };

  public async run(): Promise<string> {
    const { flags } = await this.parse(DecoupleApp);

    try {
      this.spinner.start(messages.getMessage('decouplingApp'));

      type OrgType = { getConnection(apiVersion?: string): Connection };

      const connection = (flags['target-org'] as OrgType).getConnection(flags['api-version']);
      const appFrameworkApp = new AppFrameworkApp(connection);

      // Use the app ID provided by the user
      const appId = flags['app-id'];

      // Call the decouple method
      const result = await appFrameworkApp.decoupleApp(appId);

      this.spinner.stop();

      this.log(messages.getMessage('decoupleSuccess', [appId]));

      return result;
    } catch (error) {
      this.spinner.stop();
      const errorMsg = (error as Error).message;

      if (errorMsg.includes('NOT_FOUND') || errorMsg.includes('404')) {
        throw new SfError(
          messages.getMessage('error.AppNotFound', [flags['app-id']]),
          'AppNotFound',
          messages.getMessages('error.AppNotFound.Actions')
        );
      } else if (errorMsg.includes('cannot be decoupled') || errorMsg.includes('INVALIDREQUEST')) {
        throw new SfError(
          messages.getMessage('error.CannotDecouple', [flags['app-id']]),
          'CannotDecouple',
          messages.getMessages('error.CannotDecouple.Actions')
        );
      } else if (errorMsg.includes('INVALID_OPERATION') || errorMsg.includes('400')) {
        throw new SfError(
          messages.getMessage('error.InvalidOperation'),
          'InvalidOperation',
          messages.getMessages('error.InvalidOperation.Actions')
        );
      } else {
        throw new SfError(
          messages.getMessage('error.GenericError', [errorMsg]),
          'DecoupleError',
          messages.getMessages('error.GenericError.Actions')
        );
      }
    }
  }
}