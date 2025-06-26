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

describe('orchestrator template list NUTs', () => {
  let session: TestSession;

  before(async () => {
    session = await TestSession.create({ devhubAuthStrategy: 'NONE' });
  });

  after(async () => {
    await session?.clean();
  });

  // Note: These tests require a valid org to run against
  // They are commented out as they won't pass without a real org
  /*
  it('should list templates in the org', () => {
    const command = orchestrator template list --target-org yourOrgAlias;
    const output = execCmd(command, { ensureExitCode: 0 }).shellOutput.stdout;
    expect(output).to.include('AppFramework Templates');
    expect(output).to.include('Name');
    expect(output).to.include('Label');
    expect(output).to.include('Type');
    expect(output).to.include('ID');
  });

  it('should display extended information', () => {
    const command = orchestrator template list --target-org yourOrgAlias --extended;
    const output = execCmd(command, { ensureExitCode: 0 }).shellOutput.stdout;
    // Table should include additional columns
    expect(output).to.include('Created');
    expect(output).to.include('Modified');
    
    // Should also include additional details section
    expect(output).to.include('Additional Template Details');
    expect(output).to.include('Description:');
  });
  
  it('should filter for embedded templates', () => {
    const command = orchestrator template list --target-org yourOrgAlias --includembeddedtemplates;
    const output = execCmd(command, { ensureExitCode: 0 }).shellOutput.stdout;
    // Basic verification that the command ran
    expect(output).to.include('AppFramework Templates');
  });
  
  it('should include salesforce templates', () => {
    const command = orchestrator template list --target-org yourOrgAlias --includesalesforcetemplates;
    const output = execCmd(command, { ensureExitCode: 0 }).shellOutput.stdout;
    // Basic verification that the command ran
    expect(output).to.include('AppFramework Templates');
  });
  */

  it('should see the command help', () => {
    const command = 'orchestrator template list --help';
    const output = execCmd(command, { ensureExitCode: 0 }).shellOutput.stdout;
    expect(output).to.include('orchestrator template list');
    expect(output).to.include('--target-org');
    expect(output).to.include('--api-version');
    // Don't check for specific flags that might change
  });
});
