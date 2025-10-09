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
import { execCmd, TestSession } from '@salesforce/cli-plugins-testkit';
import { expect } from 'chai';

describe('orchestrator app upgrade NUTs', () => {
  let session: TestSession;

  before(async () => {
    session = await TestSession.create({ devhubAuthStrategy: 'NONE' });
  });

  after(async () => {
    await session?.clean();
  });

  it('should show help for upgrade command', () => {
    const command = 'orchestrator app upgrade --help';
    const output = execCmd(command, { ensureExitCode: 0 }).shellOutput.stdout;
    expect(output).to.contain('Upgrade an app');
    expect(output).to.contain('--template-id');
    expect(output).to.contain('--app-id');
    expect(output).to.contain('--app-name');
  });

  it('should error without template-id flag', () => {
    const command = 'orchestrator app upgrade --app-id 1zAxx000000000123';
    const output = execCmd(command, { ensureExitCode: 2 }).shellOutput.stderr;
    expect(output).to.contain('Missing required flag');
    expect(output).to.contain('template-id');
  });

  it('should error when both app-id and app-name are provided', () => {
    const command =
      'orchestrator app upgrade --app-id 1zAxx000000000123 --app-name "My App" --template-id 1zDxx000000001EAA';
    const output = execCmd(command, { ensureExitCode: 2 }).shellOutput.stderr;
    expect(output).to.contain('exclusive');
  });
});
