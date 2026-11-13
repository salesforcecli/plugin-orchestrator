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
import DeleteApp from '../../../../src/commands/orchestrator/app/delete.js';
import AppFrameworkApp from '../../../../src/utils/app/appframeworkapp.js';

describe('orchestrator app delete', () => {
  const sandbox = sinon.createSandbox();
  let command: DeleteApp;
  let confirm: sinon.SinonStub;
  let remove: sinon.SinonStub;
  let jsonEnabled: sinon.SinonStub;
  let flags: { 'app-id': string; 'no-prompt': boolean; 'target-org': { getConnection: () => object } };

  beforeEach(() => {
    flags = { 'app-id': 'app-123', 'no-prompt': false, 'target-org': { getConnection: () => ({}) } };
    command = new DeleteApp([], {} as Config);
    sandbox.stub(command, 'parse' as keyof DeleteApp).resolves({ flags });
    sandbox.stub(command.spinner, 'start');
    sandbox.stub(command.spinner, 'stop');
    sandbox.stub(command, 'log');
    jsonEnabled = sandbox.stub(command, 'jsonEnabled').returns(false);
    confirm = sandbox.stub(command, 'confirm').resolves(false);
    sandbox.stub(AppFrameworkApp.prototype, 'getApp').resolves({ id: 'app-123', name: 'Sales' });
    remove = sandbox.stub(AppFrameworkApp.prototype, 'deleteApp').resolves();
  });

  afterEach(() => sandbox.restore());

  it('shows the confirmation text and leaves the resource intact when cancelled', async () => {
    await command.run();
    const { message } = confirm.firstCall.args[0] as { message: string };
    expect(message).to.include('Sales');
    expect(remove.called).to.be.false;
  });

  it('deletes the resolved resource after confirmation', async () => {
    confirm.resolves(true);
    await command.run();
    expect(remove.calledOnceWithExactly('app-123')).to.be.true;
  });

  it('retains confirmation in JSON mode without requiring --no-prompt', async () => {
    jsonEnabled.returns(true);
    confirm.resolves(true);
    await command.run();
    expect(confirm.calledOnce).to.be.true;
    expect(remove.calledOnceWithExactly('app-123')).to.be.true;
  });

  it('allows explicit deletion in JSON mode without prompting', async () => {
    jsonEnabled.returns(true);
    flags['no-prompt'] = true;
    await command.run();
    expect(confirm.called).to.be.false;
    expect(remove.calledOnceWithExactly('app-123')).to.be.true;
  });

  it('preserves API deletion failures', async () => {
    flags['no-prompt'] = true;
    remove.rejects(new Error('Delete permission denied'));
    await rejects(command.run(), /Delete permission denied/);
  });
});
