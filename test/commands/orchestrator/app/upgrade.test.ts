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
  const $ = new TestContext();

  beforeEach(() => {
    stubSfCommandUx($.SANDBOX);
  });

  afterEach(() => {
    $.restore();
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

  it('should have required flags configured correctly', () => {
    expect(OrchestratorAppUpgrade.flags['target-org'].required).to.be.true;
    expect(OrchestratorAppUpgrade.flags['template-id'].required).to.be.true;
  });

  it('should have exclusive flags configured correctly', () => {
    expect(OrchestratorAppUpgrade.flags['app-id'].exclusive).to.deep.equal(['app-name']);
    expect(OrchestratorAppUpgrade.flags['app-name'].exclusive).to.deep.equal(['app-id']);
  });

  it('should have correct options for runtime-method flag', () => {
    expect(OrchestratorAppUpgrade.flags['runtime-method'].options).to.deep.equal(['sync', 'async']);
  });

  it('should have correct options for log-level flag', () => {
    expect(OrchestratorAppUpgrade.flags['log-level'].options).to.deep.equal(['debug', 'info', 'warn', 'error']);
  });

  it('should validate flags correctly', () => {
    // Test validateRequiredFlags static method
    expect(() => {
      // @ts-expect-error - accessing private static method for testing
      OrchestratorAppUpgrade.validateRequiredFlags({});
    }).to.throw('No app specified for upgrade');

    expect(() => {
      // @ts-expect-error - accessing private static method for testing
      OrchestratorAppUpgrade.validateRequiredFlags({ 'app-id': 'test' });
    }).to.not.throw();
  });

  it('should parse template values correctly', () => {
    // @ts-expect-error - accessing private static method for testing
    const result = OrchestratorAppUpgrade.parseTemplateValues('{"key": "value"}');
    expect(result).to.deep.equal({ key: 'value' });
  });

  it('should handle invalid JSON template values', () => {
    expect(() => {
      // @ts-expect-error - accessing private static method for testing
      OrchestratorAppUpgrade.parseTemplateValues('invalid-json');
    }).to.throw('Invalid template values JSON');
  });

  it('should reject array template values', () => {
    expect(() => {
      // @ts-expect-error - accessing private static method for testing
      OrchestratorAppUpgrade.parseTemplateValues('["array", "not", "object"]');
    }).to.throw('Template values must be a valid JSON object');
  });

  it('should build update options correctly', () => {
    const flags = {
      'template-id': 'test-template',
      'runtime-method': 'sync',
      'log-level': 'debug',
      'chain-name': 'test-chain',
    };

    // @ts-expect-error - accessing private static method for testing
    const options = OrchestratorAppUpgrade.buildUpdateOptions(flags, { test: 'value' });

    expect(options.templateSourceId).to.equal('test-template');
    expect(options.runtimeMethod).to.equal('sync');
    expect(options.logLevel).to.equal('debug');
    expect(options.chainName).to.equal('test-chain');
    expect(options.templateValues).to.deep.equal({ test: 'value' });
  });
});
