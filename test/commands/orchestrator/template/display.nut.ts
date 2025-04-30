/*
 * Copyright (c) 2025, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
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
    const command = orchestrator template display --template-id 0NRxx000000000x --target-org yourOrgAlias;
    const output = execCmd(command, { ensureExitCode: 0 }).shellOutput.stdout;
    
    // Check basic output format
    expect(output).to.include('Template Details');
    expect(output).to.include('ID:');
    expect(output).to.include('Name:');
    expect(output).to.include('Label:');
  });
  
  it('should display a template by name', () => {
    const command = orchestrator template display --name "My Template" --target-org yourOrgAlias;
    const output = execCmd(command, { ensureExitCode: 0 }).shellOutput.stdout;
    
    // Basic output verification
    expect(output).to.include('Template Details');
    expect(output).to.include('My Template');
  });
  
  it('should error with invalid template ID', () => {
    const command = orchestrator template display --template-id nonexistent-id --target-org yourOrgAlias;
    // This should error
    const output = execCmd(command, { ensureExitCode: 1 }).shellOutput.stderr;
    expect(output).to.include('Error');
  });
  */

  it('should show help with required flags', () => {
    const command = 'orchestrator template display --help';
    const output = execCmd(command, { ensureExitCode: 0 }).shellOutput.stdout;
    expect(output).to.include('orchestrator template display');
    expect(output).to.include('--template-id');
    expect(output).to.include('--name');
    expect(output).to.include('--target-org');
  });

  it('should error when neither template-id nor name is provided', () => {
    const command = 'orchestrator template display';
    const output = execCmd(command, { ensureExitCode: 1 }).shellOutput.stderr;
    expect(output).to.include('--template-id or --name');
  });
});
