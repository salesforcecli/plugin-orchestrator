/*
 * Copyright (c) 2025, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
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
    expect(output).to.include('Delete an AppFramework template');
    expect(output).to.include('--template-id');
    expect(output).to.include('--name');
    expect(output).to.include('--force-delete');
    expect(output).to.include('--decouple');
  });

  it('should error without template-id flag', () => {
    const command = 'orchestrator template delete';
    const result = execCmd(command, { ensureExitCode: 1 });
    expect(result.shellOutput.stderr).to.include('Missing required flag');
    expect(result.shellOutput.stderr).to.include('--template-id');
  });

  it('should error without an org', () => {
    const command = 'orchestrator template delete --template-id 0XtB000000001aXYAQ';
    const result = execCmd(command, { ensureExitCode: 1 });
    expect(result.shellOutput.stderr).to.include('Missing required flag');
    expect(result.shellOutput.stderr).to.include('--target-org');
  });

  it('should warn about exclusive flags if both provided', () => {
    const command = 'orchestrator template delete --template-id 0XtB000000001aXYAQ --force-delete --decouple';
    const result = execCmd(command, { ensureExitCode: 1 });
    expect(result.shellOutput.stderr).to.include('error');
    expect(result.shellOutput.stderr).to.include('--force-delete');
    expect(result.shellOutput.stderr).to.include('--decouple');
  });

  it('should display provided name', () => {
    const command = 'orchestrator template delete --name World';
    const result = execCmd(command, { ensureExitCode: 1 });
    expect(result.shellOutput.stderr).to.include('World');
  });
});
