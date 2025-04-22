/*
 * Copyright (c) 2025, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { execCmd, TestSession } from '@salesforce/cli-plugins-testkit';
import { expect } from 'chai';

describe('appframework template display NUTs', () => {
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
  it('should display template details when template ID is provided', () => {
    const command = appframework template display --template-id 0NRxx000000000x --target-org yourOrgAlias;
    const output = execCmd(command, { ensureExitCode: 0 }).shellOutput.stdout;
    expect(output).to.include('Basic Information:');
    expect(output).to.include('ID:');
    expect(output).to.include('Name:');
    expect(output).to.include('Label:');
    expect(output).to.include('Type:');
  });

  it('should display template details when template name is provided', () => {
    const command = appframework template display --name "My Template" --target-org yourOrgAlias;
    const output = execCmd(command, { ensureExitCode: 0 }).shellOutput.stdout;
    expect(output).to.include('Basic Information:');
    expect(output).to.include('ID:');
    expect(output).to.include('Name:');
    expect(output).to.include('Label:');
    expect(output).to.include('Type:');
  });
  
  it('should error when template ID is not found', () => {
    const command = appframework template display --template-id nonexistent-id --target-org yourOrgAlias;
    const { stderr } = execCmd(command, { ensureExitCode: 1 });
    expect(stderr).to.include('Template with ID "nonexistent-id" not found');
  });
  */

  it('should show help with required flags', () => {
    const command = 'appframework template display --help';
    const output = execCmd(command, { ensureExitCode: 0 }).shellOutput.stdout;

    expect(output).to.include('appframework template display');
    expect(output).to.include('--template-id');
    expect(output).to.include('target-org');
    expect(output).to.include('api-version');
  });

  it('should error when neither template-id nor name is provided', () => {
    const command = 'appframework template display';
    const result = execCmd(command, { ensureExitCode: 1 });

    expect(result.shellOutput.stderr).to.include('Error');
  });
});
