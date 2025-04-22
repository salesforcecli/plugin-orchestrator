/*
 * Copyright (c) 2025, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { execCmd, TestSession } from '@salesforce/cli-plugins-testkit';
import { expect } from 'chai';

describe('appframework template delete NUTs', () => {
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
    const command = 'appframework template delete --help';
    const output = execCmd(command, { ensureExitCode: 0 }).shellOutput.stdout;
    expect(output).to.include('Delete an AppFramework template');
    expect(output).to.include('--template-id');
    expect(output).to.include('--force-delete');
    expect(output).to.include('--decouple');
    expect(output).to.include('--no-prompt');
  });

  it('should error without template-id flag', () => {
    const command = 'appframework template delete';
    const output = execCmd(command, { ensureExitCode: 1 }).shellOutput.stderr;

    expect(output).to.include('Error');
  });

  it('should error without an org', () => {
    const command = 'appframework template delete --template-id 0XtB000000001aXYAQ';
    const output = execCmd(command, { ensureExitCode: 1 }).shellOutput.stderr;

    expect(output).to.include('Error');
    expect(output).to.include('--target-org');
  });

  it('should warn about exclusive flags if both provided', () => {
    const command = 'appframework template delete --template-id 0XtB000000001aXYAQ --force-delete --decouple';
    const output = execCmd(command, { ensureExitCode: 1 }).shellOutput.stderr;

    expect(output).to.include('Error');
  });

  it('should display provided name', () => {
    const command = 'appframework template delete --name World';
    const result = execCmd(command, { ensureExitCode: 1 });

    expect(result.shellOutput.stderr).to.include('No default environment found');
  });
});
