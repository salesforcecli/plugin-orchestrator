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
import sinon from 'sinon';
import { Config } from '@oclif/core';
import CreateTemplate from '../../../../src/commands/orchestrator/create/template.js';
import { RawTemplate } from '../../../../src/utils/template/templateTypes.js';
import AppFrameworkTemplate from '../../../../src/utils/template/appframeworktemplate.js';

/**
 * Tests for the create template command
 *
 * These tests check that template creation works correctly
 */
describe('orchestrator create template', () => {
  const sandbox = sinon.createSandbox();
  let createStub: sinon.SinonStub;
  let getTemplateStub: sinon.SinonStub;

  const mockTemplate: RawTemplate = {
    id: 'template-123',
    name: 'TestTemplate',
    label: 'Test Template',
    description: 'A test template',
    templateType: 'dashboard',
    createdDate: '2023-01-01T12:00:00Z',
    lastModifiedDate: '2023-01-01T12:00:00Z',
    tags: {
      industries: ['Healthcare'],
      targetAudience: ['Admins'],
    },
  };

  beforeEach(() => {
    // Create stubs for the AppFrameworkTemplate methods
    createStub = sandbox.stub(AppFrameworkTemplate.prototype, 'create').resolves('template-123');
    getTemplateStub = sandbox.stub(AppFrameworkTemplate.prototype, 'getTemplate').resolves(mockTemplate);
  });

  afterEach(() => {
    sandbox.restore();
  });

  /**
   * Tests the creation of a template from a JSON file
   */
  it('should create a template from a JSON file', async () => {
    // Arrange
    const command = new CreateTemplate([], {} as Config);

    // Mock the command's parse method
    sandbox.stub(command, 'parse' as keyof CreateTemplate).resolves({
      flags: {
        name: 'TestTemplate',
        type: 'dashboard',
        'target-org': { getConnection: () => ({}) },
      },
    });

    // Mock other command methods to avoid actual execution
    sandbox.stub(command.spinner, 'start');
    sandbox.stub(command.spinner, 'stop');
    sandbox.stub(command, 'log');

    // Act
    const result = await command.run();

    // Assert
    expect(createStub.calledOnce).to.be.true;
    expect(getTemplateStub.calledOnce).to.be.true;
    expect(result).to.equal('template-123');
  });

  /**
   * Tests error handling when the API returns an error
   */
  it('should handle API errors appropriately', async () => {
    // Arrange
    const command = new CreateTemplate([], {} as Config);

    // Mock the command's parse method
    sandbox.stub(command, 'parse' as keyof CreateTemplate).resolves({
      flags: {
        name: 'TestTemplate',
        type: 'dashboard',
        'target-org': { getConnection: () => ({}) },
      },
    });

    // Mock other command methods to avoid actual execution
    sandbox.stub(command.spinner, 'start');
    sandbox.stub(command.spinner, 'stop');

    // Make the create method throw an error
    createStub.rejects(new Error('API Error'));

    // Act & Assert
    try {
      await command.run();
      expect.fail('Should have thrown an error');
    } catch (error) {
      expect(error).to.be.an('error');
      expect((error as Error).message).to.include('API Error');
    }
  });
});
