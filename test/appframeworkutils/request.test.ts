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

import { expect } from 'chai';
import { Connection } from '@salesforce/core';
import sinon from 'sinon';
import { request } from '../../src/utils/request.js';

type MockConnection = {
  request: sinon.SinonStub;
  getApiVersion: sinon.SinonStub;
};

describe('request', () => {
  let connectionStub: Connection;
  let requestStub: sinon.SinonStub;
  let getApiVersionStub: sinon.SinonStub;
  const apiVersion = '59.0';

  beforeEach(() => {
    requestStub = sinon.stub();
    getApiVersionStub = sinon.stub().returns(apiVersion);

    const mockConnectionProps: MockConnection = {
      request: requestStub,
      getApiVersion: getApiVersionStub,
    };

    connectionStub = mockConnectionProps as unknown as Connection;
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should call connection.request with correct parameters for GET', async () => {
    const mockResponse = { foo: 'bar' };
    requestStub.resolves(mockResponse);

    const result = await request<{ foo: string }>(connectionStub, {
      method: 'GET',
      url: '/test-endpoint',
    });

    expect(requestStub.calledOnce).to.be.true;
    expect(requestStub.firstCall.args[0]).to.deep.equal({
      method: 'GET',
      url: '/services/data/v' + apiVersion + '/app-framework/test-endpoint',
      body: undefined,
    });

    expect(result).to.equal(mockResponse);
  });

  it('should include body for POST requests', async () => {
    const mockResponse = { success: true };
    requestStub.resolves(mockResponse);

    const payload = { name: 'test', value: 123 };

    const result = await request<{ success: boolean }>(connectionStub, {
      method: 'POST',
      url: '/create',
      body: payload,
    });

    expect(requestStub.calledOnce).to.be.true;
    expect(requestStub.firstCall.args[0]).to.deep.equal({
      method: 'POST',
      url: '/services/data/v' + apiVersion + '/app-framework/create',
      body: JSON.stringify(payload),
    });

    expect(result).to.equal(mockResponse);
  });

  it('should handle error responses', async () => {
    const errorResponse = new Error('API Error');
    requestStub.rejects(errorResponse);

    try {
      await request<unknown>(connectionStub, {
        method: 'GET',
        url: '/error-endpoint',
      });
      expect.fail('Expected an error to be thrown');
    } catch (error) {
      expect(error).to.equal(errorResponse);
    }
  });
});
