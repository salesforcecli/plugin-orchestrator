/*
 * Copyright (c) 2025, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { execCmd, TestSession } from '@salesforce/cli-plugins-testkit';
import { expect } from 'chai';

describe('appframework:template:create NUTs', () => {
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
    const command = 'appframework template create --help';
    const output = execCmd(command, { ensureExitCode: 0 }).shellOutput.stdout;
    expect(output).to.include('Create a new AppFramework template');
    expect(output).to.include('--name');
    expect(output).to.include('--label');
    expect(output).to.include('--description');
  });

  it('should error without target-org flag', () => {
    const command = 'appframework template create';
    const output = execCmd(command, { ensureExitCode: 1 }).shellOutput.stderr;

    expect(output).to.include('Error');
    expect(output).to.include('--target-org');
  });

  it('should error without name flag', () => {
    const command = 'appframework template create --target-org dummy@example.com';
    const output = execCmd(command, { ensureExitCode: 1 }).shellOutput.stderr;

    expect(output).to.include('Error');
  });

  it('should run with name and target-org', () => {
    const command = 'appframework template create --target-org dummy@example.com --name my_template';
    const output = execCmd(command, { ensureExitCode: 1 }).shellOutput.stderr;

    expect(output).to.include('No authorization information found');
  });
});
