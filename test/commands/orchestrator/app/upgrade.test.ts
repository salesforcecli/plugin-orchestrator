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

  it('should have correct command flags', async () => {
    expect(OrchestratorAppUpgrade.flags['target-org']).to.exist;
    expect(OrchestratorAppUpgrade.flags['template-id']).to.exist;
    expect(OrchestratorAppUpgrade.flags['app-id']).to.exist;
    expect(OrchestratorAppUpgrade.flags['app-name']).to.exist;
    expect(OrchestratorAppUpgrade.flags['template-values']).to.exist;
    expect(OrchestratorAppUpgrade.flags['runtime-method']).to.exist;
    expect(OrchestratorAppUpgrade.flags['log-level']).to.exist;
    expect(OrchestratorAppUpgrade.flags['chain-name']).to.exist;
  });

  it('should have correct command properties', async () => {
    expect(OrchestratorAppUpgrade.summary).to.be.a('string');
    expect(OrchestratorAppUpgrade.description).to.be.a('string');
    expect(OrchestratorAppUpgrade.examples).to.be.an('array');
    expect(OrchestratorAppUpgrade.state).to.equal('preview');
  });
});
