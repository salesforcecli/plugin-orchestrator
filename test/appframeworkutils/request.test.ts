/*
 * Copyright (c) 2025, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
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
