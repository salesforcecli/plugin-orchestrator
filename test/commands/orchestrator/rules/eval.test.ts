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
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Config } from '@oclif/core';
import { expect } from 'chai';
import sinon from 'sinon';
import RulesEval from '../../../../src/commands/orchestrator/rules/eval.js';

describe('rules eval', () => {
  const sandbox = sinon.createSandbox();
  let directory: string;
  let command: RulesEval;
  let request: sinon.SinonStub;
  let document: string;

  beforeEach(async () => {
    directory = await mkdtemp(join(tmpdir(), 'orchestrator-rules-'));
    document = join(directory, 'document.json');
    const values = join(directory, 'values.json');
    const rules = join(directory, 'rules.json');
    await Promise.all([
      writeFile(document, '{"name":"Sales"}'),
      writeFile(values, '{"label":"Revenue"}'),
      writeFile(rules, '{"rules":[]}'),
    ]);
    request = sandbox.stub().resolves({ name: 'Revenue' });
    command = new RulesEval([], {} as Config);
    sandbox.stub(command, 'parse' as keyof RulesEval).resolves({
      flags: {
        document,
        values,
        rules,
        'target-org': { getConnection: () => ({ request, getApiVersion: () => '65.0' }) },
      },
    });
    sandbox.stub(command, 'log');
  });

  afterEach(async () => {
    sandbox.restore();
    await rm(directory, { recursive: true, force: true });
  });

  it('submits the file payload and returns the API result', async () => {
    const result = await command.run();
    const options = request.firstCall.args[0] as { method: string; url: string; body: string };
    expect(options).to.include({
      method: 'POST',
      url: '/services/data/v65.0/jsonxform/transformation',
    });
    expect(JSON.parse(options.body)).to.deep.equal({
      document: { name: 'Sales' },
      values: { label: 'Revenue' },
      definition: { rules: [] },
    });
    expect(result.output).to.deep.equal({ name: 'Revenue' });
  });

  it('rejects API failures instead of returning normally with an error result', async () => {
    const error = new Error('Transformation permission denied');
    request.rejects(error);
    await rejects(command.run(), (actual) => actual === error);
  });

  it('rejects malformed JSON before calling the API', async () => {
    await writeFile(document, '{');
    await rejects(command.run(), SyntaxError);
    expect(request.called).to.be.false;
  });
});
