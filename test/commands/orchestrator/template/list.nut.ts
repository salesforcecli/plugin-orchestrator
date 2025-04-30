/*
 * Copyright (c) 2025, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
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
