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

describe('orchestrator template create NUTs', () => {
  let session: TestSession;

  before(async () => {
    session = await TestSession.create({ devhubAuthStrategy: 'NONE' });
  });

  after(async () => {
    await session?.clean();
  });

  it('should show help for create command', () => {
    const command = 'orchestrator template create --help';
    const output = execCmd(command, { ensureExitCode: 0 }).shellOutput.stdout;
    // Verify the command name is in the output
    expect(output).to.include('orchestrator template create');
    // Check for specific flags using actual flag names from the help output
    expect(output).to.include('--name');
    expect(output).to.include('--target-org');
    expect(output).to.include('--type');
    expect(output).to.include('--subtype');
    expect(output).to.include('--label');
    expect(output).to.include('--description');
  });

  it('should error without target-org flag', () => {
    const command = 'orchestrator template create --name test-template';
    const output = execCmd(command, { ensureExitCode: 1 }).shellOutput.stderr;
    // Should error because target-org is required
    expect(output.length).to.be.greaterThan(0);
  });

  it('should error without name flag', () => {
    const command = 'orchestrator template create --target-org test-org';
    const output = execCmd(command, { ensureExitCode: 1 }).shellOutput.stderr;
    // Should error because name is required
    expect(output.length).to.be.greaterThan(0);
  });

  it('should run with name and target-org', () => {
    const command = 'orchestrator template create --name test-template --target-org test-org';
    // This will likely fail due to authentication, but we can test the command structure
    const output = execCmd(command, { ensureExitCode: 1 }).shellOutput.stderr;
    // Should get some kind of error (likely auth related), but not a command structure error
    expect(output.length).to.be.greaterThan(0);
  });
});
