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
import UpdateApp from '../../../../src/commands/orchestrator/app/update.js';
import AppFrameworkApp from '../../../../src/utils/app/appframeworkapp.js';

describe('orchestrator app update', () => {
  const sandbox = sinon.createSandbox();
  let command: UpdateApp;
  let patch: sinon.SinonStub;
  let getApp: sinon.SinonStub;

  beforeEach(() => {
    command = new UpdateApp([], {} as Config);
    sandbox.stub(command, 'parse' as keyof UpdateApp).resolves({
      flags: {
        'app-id': 'app-123',
        label: 'Revenue',
        'target-org': { getConnection: () => ({}) },
      },
    });
    sandbox.stub(command.spinner, 'start');
    sandbox.stub(command.spinner, 'stop');
    sandbox.stub(command, 'log');
    sandbox.stub(command, 'debug' as keyof UpdateApp);
    patch = sandbox.stub(AppFrameworkApp.prototype, 'patchApp').resolves('app-123');
    getApp = sandbox.stub(AppFrameworkApp.prototype, 'getApp').resolves(null);
  });

  afterEach(() => sandbox.restore());

  it('returns the updated app ID when the follow-up display fetch fails', async () => {
    getApp.rejects(new Error('Read permission denied'));
    expect(await command.run()).to.equal('app-123');
    expect(patch.calledOnceWithExactly('app-123', { label: 'Revenue', description: undefined })).to.be.true;
  });

  it('still rejects mutation errors without fetching display details', async () => {
    patch.rejects(new Error('Update permission denied'));
    await rejects(command.run(), /Update permission denied/);
    expect(getApp.called).to.be.false;
  });
});
