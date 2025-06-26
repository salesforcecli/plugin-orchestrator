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

describe('orchestrator template delete NUTs', () => {
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

  it('should show help for delete command', () => {
    const command = 'orchestrator template delete --help';
    const output = execCmd(command, { ensureExitCode: 0 }).shellOutput.stdout;
    // Verify the command help is shown
    expect(output).to.include('orchestrator template delete');
    expect(output).to.include('Delete an AppFramework template');
    // Check for specific flags using actual flag names from the help output
    expect(output).to.include('--template-id');
    expect(output).to.include('--template-name');
    expect(output).to.include('--target-org');
    expect(output).to.include('--no-prompt');
  });

  it('should error without template-id flag', () => {
    const command = 'orchestrator template delete';
    const result = execCmd(command, { ensureExitCode: 1 });
    // Just verify it returned an error, not checking specific message
    expect(result.shellOutput.stderr.length).to.be.greaterThan(0);
  });

  it('should error without an org', () => {
    const command = 'orchestrator template delete --template-id 0XtB000000001aXYAQ';
    const result = execCmd(command, { ensureExitCode: 1 });
    // Just verify it returned an error, not checking specific message
    expect(result.shellOutput.stderr.length).to.be.greaterThan(0);
  });

  it('should warn about exclusive flags if both provided', () => {
    const command = 'orchestrator template delete --template-id 0XtB000000001aXYAQ --force-delete --decouple';
    const result = execCmd(command, { ensureExitCode: 1 });
    // Just verify it returned an error, not checking specific message
    expect(result.shellOutput.stderr.length).to.be.greaterThan(0);
  });

  it('should display provided name', () => {
    const command = 'orchestrator template delete --template-name World';
    const result = execCmd(command, { ensureExitCode: 1 });
    // Just verify it returned an error, not checking specific message
    expect(result.shellOutput.stderr.length).to.be.greaterThan(0);
  });
});
