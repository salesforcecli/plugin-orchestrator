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

describe('orchestrator:template:create NUTs', () => {
  let session: TestSession;

  before(async () => {
    session = await TestSession.create({
      project: {
        name: 'appFrameworkTemplateNUTs',
      },
      devhubAuthStrategy: 'NONE',
    });
  });

  after(async () => {
    await session?.clean();
  });

  it('should show help for create command', () => {
    const command = 'orchestrator template create --help';
    const output = execCmd(command, { ensureExitCode: 0 }).shellOutput.stdout;
    expect(output).to.include('orchestrator template create');
    expect(output).to.include('Create a new AppFramework template');
    expect(output).to.include('--name');
    expect(output).to.include('--target-org');
    expect(output).to.include('--type');
    expect(output).to.include('--subtype');
    expect(output).to.include('--label');
  });

  it('should error without target-org flag', () => {
    const command = 'orchestrator template create';
    const result = execCmd(command, { ensureExitCode: 1 });
    expect(result.shellOutput.stderr.length).to.be.greaterThan(0);
  });

  it('should error without name flag', () => {
    const command = 'orchestrator template create --target-org dummy@example.com';
    const result = execCmd(command, { ensureExitCode: 1 });
    expect(result.shellOutput.stderr.length).to.be.greaterThan(0);
  });

  it('should run with name and target-org', () => {
    const command = 'orchestrator template create --target-org dummy@example.com --name my_template';
    const result = execCmd(command, { ensureExitCode: 1 });
    expect(result.shellOutput.stderr.length).to.be.greaterThan(0);
  });
});
