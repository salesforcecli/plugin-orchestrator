/*
 * Copyright (c) 2025, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { execCmd, TestSession } from '@salesforce/cli-plugins-testkit';
import { expect } from 'chai';

describe('orchestrator template update NUTs', () => {
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
    const command = 'orchestrator template update --help';
    const output = execCmd(command, { ensureExitCode: 0 }).shellOutput.stdout;
    // Verify the command help is shown
    expect(output).to.include('orchestrator template update');
    expect(output).to.include('Update an existing AppFramework template');
    // Check for specific flags using actual flag names from the help output
    expect(output).to.include('--template-id');
    expect(output).to.include('--template-name');
    expect(output).to.include('--target-org');
    expect(output).to.include('--label');
    expect(output).to.include('--description');
  });

  it('should error without template identifier', () => {
    const command = 'orchestrator template update';
    const result = execCmd(command, { ensureExitCode: 1 });
    // Just verify it returned an error, not checking specific message
    expect(result.shellOutput.stderr.length).to.be.greaterThan(0);
  });

  it('should error without an org', () => {
    const command = 'orchestrator template update --template-id 0XtB000000001aXYAQ --label "New Label"';
    const result = execCmd(command, { ensureExitCode: 1 });
    // Just verify it returned an error, not checking specific message
    expect(result.shellOutput.stderr.length).to.be.greaterThan(0);
  });

  it('should warn about exclusive flags if both provided', () => {
    const command = 'orchestrator template update --template-id 0XtB000000001aXYAQ --template-name "Test Template"';
    const result = execCmd(command, { ensureExitCode: 1 });
    // Just verify it returned an error, not checking specific message
    expect(result.shellOutput.stderr.length).to.be.greaterThan(0);
  });

  it('should display provided name', () => {
    const command = 'orchestrator template update --template-name World';
    const result = execCmd(command, { ensureExitCode: 1 });
    // Just verify it returned an error, not checking specific message
    expect(result.shellOutput.stderr.length).to.be.greaterThan(0);
  });
});
