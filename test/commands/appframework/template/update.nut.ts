/*
 * Copyright (c) 2025, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { execCmd, TestSession } from '@salesforce/cli-plugins-testkit';
import { expect } from 'chai';

describe('appframework template update NUTs', () => {
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

  it('should show help for update command', () => {
    const command = 'appframework template update --help';
    const output = execCmd(command, { ensureExitCode: 0 }).shellOutput.stdout;
    expect(output).to.include('Update an existing AppFramework template');
    expect(output).to.include('--template-id');
    expect(output).to.include('target-org');
  });

  it('should error without template identifier', () => {
    const command = 'appframework template update';
    const output = execCmd(command, { ensureExitCode: 1 }).shellOutput.stderr;
    expect(output).to.include('Error');
  });

  it('should error without an org', () => {
    const command = 'appframework template update --template-id 0XtB000000001aXYAQ --folder-id 0FbB000000001XxKAI';
    const output = execCmd(command, { ensureExitCode: 1 }).shellOutput.stderr;
    expect(output).to.include('Error');
    expect(output).to.include('--target-org');
  });

  it('should warn about exclusive flags if both provided', () => {
    const command = 'appframework template update --template-id 0XtB000000001aXYAQ --template-name "Test Template"';
    const output = execCmd(command, { ensureExitCode: 1 }).shellOutput.stderr;
    expect(output).to.include('Error');
  });

  it('should display provided name', () => {
    const command = 'appframework template update --name World';
    const result = execCmd(command, { ensureExitCode: 1 });

    expect(result.shellOutput.stderr).to.include('No default environment found');
  });
});
