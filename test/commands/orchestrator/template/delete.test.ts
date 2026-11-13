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

import { rejects } from 'node:assert/strict';
import { Config } from '@oclif/core';
import { expect } from 'chai';
import sinon from 'sinon';
import DeleteTemplate from '../../../../src/commands/orchestrator/template/delete.js';
import AppFrameworkTemplate from '../../../../src/utils/template/appframeworktemplate.js';

describe('orchestrator template delete', () => {
  const sandbox = sinon.createSandbox();
  let command: DeleteTemplate;
  let confirm: sinon.SinonStub;
  let remove: sinon.SinonStub;
  let flags: { 'template-id': string; 'no-prompt': boolean; 'target-org': { getConnection: () => object } };

  beforeEach(() => {
    flags = { 'template-id': 'template-123', 'no-prompt': false, 'target-org': { getConnection: () => ({}) } };
    command = new DeleteTemplate([], {} as Config);
    sandbox.stub(command, 'parse' as keyof DeleteTemplate).resolves({ flags });
    sandbox.stub(command.spinner, 'start');
    sandbox.stub(command.spinner, 'stop');
    sandbox.stub(command, 'log');
    confirm = sandbox.stub(command, 'confirm').resolves(false);
    sandbox.stub(AppFrameworkTemplate.prototype, 'getTemplate').resolves({ id: 'template-123' });
    remove = sandbox.stub(AppFrameworkTemplate.prototype, 'deleteTemplate').resolves();
  });

  afterEach(() => sandbox.restore());

  it('shows the confirmation text and leaves the resource intact when cancelled', async () => {
    await command.run();
    const { message } = confirm.firstCall.args[0] as { message: string };
    expect(message).to.include('Are you sure');
    expect(remove.called).to.be.false;
  });

  it('deletes the resolved resource after confirmation', async () => {
    confirm.resolves(true);
    await command.run();
    expect(remove.calledOnceWithExactly('template-123')).to.be.true;
  });

  it('deletes without prompting when --no-prompt is provided', async () => {
    flags['no-prompt'] = true;
    await command.run();
    expect(confirm.called).to.be.false;
    expect(remove.calledOnceWithExactly('template-123')).to.be.true;
  });

  it('preserves API deletion failures', async () => {
    flags['no-prompt'] = true;
    remove.rejects(new Error('Delete permission denied'));
    await rejects(command.run(), /Delete permission denied/);
  });
});
