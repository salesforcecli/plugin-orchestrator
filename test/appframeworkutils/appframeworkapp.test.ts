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
import { expect } from 'chai';
import { Connection } from '@salesforce/core';
import sinon from 'sinon';
import AppFrameworkApp from '../../src/utils/app/appframeworkapp.js';

describe('AppFrameworkApp creation', () => {
  const sandbox = sinon.createSandbox();
  let request: sinon.SinonStub;
  let apps: AppFrameworkApp;

  beforeEach(() => {
    request = sandbox.stub();
    apps = new AppFrameworkApp({ request, getApiVersion: () => '65.0' } as unknown as Connection);
  });

  afterEach(() => sandbox.restore());

  for (const response of [{ id: 'app-123' }, { app: { id: 'app-123' } }, { apps: [{ id: 'app-123' }] }]) {
    it(`returns the ID from ${JSON.stringify(response)}`, async () => {
      request.resolves(response);
      expect(await apps.create({ name: 'Sales', templateSourceId: 'template-123' })).to.equal('app-123');
    });
  }

  it('rejects a response without an ID instead of returning a success message as the ID', async () => {
    request.resolves({});
    await rejects(apps.create({ name: 'Sales', templateSourceId: 'template-123' }), /did not include an app ID/);
  });
});
