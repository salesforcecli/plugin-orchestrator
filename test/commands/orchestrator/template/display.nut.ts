/*
 * Copyright 2026, Salesforce, Inc.
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

describe('orchestrator template display NUTs', () => {
  let session: TestSession;

  before(async () => {
    session = await TestSession.create({ devhubAuthStrategy: 'NONE' });
  });

  after(async () => {
    await session?.clean();
  });

  // Note: These tests require a valid org to run against and a valid template
  // They are commented out as they won't pass without real resources
  /*
  it('should display a template by ID', () => {
    const command = 'orchestrator template display --template-id 0NRxx000000000x --target-org yourOrgAlias';
    const output = execCmd(command, { ensureExitCode: 0 }).shellOutput.stdout;
    
    // Check basic output format
    expect(output).to.include('Template Details');
    expect(output).to.include('ID:');
    expect(output).to.include('Name:');
    expect(output).to.include('Label:');
  });
  
  it('should display a template by name', () => {
    const command = 'orchestrator template display --name "My Template" --target-org yourOrgAlias';
    const output = execCmd(command, { ensureExitCode: 0 }).shellOutput.stdout;
    
    // Basic output verification
    expect(output).to.include('Template Details');
    expect(output).to.include('My Template');
  });
  
  it('should error with invalid template ID', () => {
    const command = 'orchestrator template display --template-id nonexistent-id --target-org yourOrgAlias';
    // This should error
    const output = execCmd(command, { ensureExitCode: 1 }).shellOutput.stderr;
    expect(output).to.include('Error');
  });
  */

  it('should show help with required flags', () => {
    const command = 'orchestrator template display --help';
    const output = execCmd(command, { ensureExitCode: 0 }).shellOutput.stdout;
    // Verify the command name is in the output
    expect(output).to.include('orchestrator template display');
    // Check for specific flags using actual flag names from the help output
    expect(output).to.include('--template-id');
    expect(output).to.include('--template-name');
    expect(output).to.include('--target-org');
    expect(output).to.include('--api-version');
  });

  it('should error when neither template-id nor name is provided', () => {
    const command = 'orchestrator template display';
    const output = execCmd(command, { ensureExitCode: 1 }).shellOutput.stderr;
    // Just make sure it returns an error, not checking specific message
    expect(output.length).to.be.greaterThan(0);
  });
});
