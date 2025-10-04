/*
 * Copyright 2025, Salesforce, Inc.
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
import { TestContext } from '@salesforce/core/testSetup';
import { expect } from 'chai';
import { stubSfCommandUx } from '@salesforce/sf-plugins-core';
import OrchestratorAppUpgrade from '../../../../src/commands/orchestrator/app/upgrade.js';

describe('orchestrator app upgrade', () => {
  const $$ = new TestContext();
  beforeEach(() => {
    stubSfCommandUx($$.SANDBOX);
  });

  afterEach(() => {
    $$.restore();
  });

  it('should require target-org flag', async () => {
    try {
      await OrchestratorAppUpgrade.run([]);
      expect.fail('Should have thrown an error');
    } catch (error) {
      expect((error as Error).message).to.include('Missing required flag');
    }
  });

  it('runs upgrade with required flags', async () => {
    const result = await OrchestratorAppUpgrade.run([
      '--target-org',
      'test@example.com',
      '--app-id',
      'testAppId',
      '--template-id',
      'testTemplateId',
    ]);
    expect(result.appId).to.be.a('string');
  });

  it('runs upgrade with app name', async () => {
    const result = await OrchestratorAppUpgrade.run([
      '--target-org',
      'test@example.com',
      '--app-name',
      'TestApp',
      '--template-id',
      'testTemplateId',
    ]);
    expect(result.appId).to.be.a('string');
  });
});
