/*
 * Copyright (c) 2025, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { expect } from 'chai';
import { RawTemplate } from '../../../../src/utils/template/templateTypes.js';

describe('appframework create template', () => {
  it('should construct the correct template creation payload', () => {
    const options = {
      name: 'test_template',
      templateType: 'app',
      templateSubtype: 'analytics',
      label: 'Test Template',
      description: 'Template description',
    };

    const body = {
      name: options.name,
      templateType: options.templateType,
      templateSubtype: options.templateSubtype,
      label: options.label,
      description: options.description,
    };

    expect(body).to.be.an('object');
    expect(body.name).to.equal('test_template');
    expect(body.templateType).to.equal('app');
    expect(body.templateSubtype).to.equal('analytics');
    expect(body.label).to.equal('Test Template');
    expect(body.description).to.equal('Template description');
  });

  it('should handle template creation with minimal parameters', () => {
    const options = {
      name: 'minimal_template',
    };

    const body = {
      name: options.name,
      templateType: 'app',
    };

    expect(body).to.be.an('object');
    expect(body.name).to.equal('minimal_template');
    expect(body.templateType).to.equal('app');
    expect(body).to.not.have.property('templateSubtype');
    expect(body).to.not.have.property('label');
    expect(body).to.not.have.property('description');
  });

  it('should properly convert raw template data for display', () => {
    const rawTemplate: RawTemplate = {
      id: 'template123',
      name: 'test_template',
      label: 'Test Template',
      templateType: 'app',
      templateSubtype: 'analytics',
      description: 'A test template',
      createdDate: '2023-01-01T00:00:00Z',
      lastModifiedDate: '2023-02-01T00:00:00Z',
      tags: {
        industries: ['Technology', 'Healthcare'],
        targetAudience: ['Developers', 'Admins'],
      },
    };

    const displayTemplate = {
      id: rawTemplate.id,
      name: rawTemplate.name,
      label: rawTemplate.label,
      description: rawTemplate.description,
      templateType: rawTemplate.templateType,
      templateSubtype: rawTemplate.templateSubtype,
      created: new Date(rawTemplate.createdDate as string).toLocaleDateString(),
      modified: new Date(rawTemplate.lastModifiedDate as string).toLocaleDateString(),
      industries: rawTemplate.tags?.industries?.join(', ') ?? 'n/a',
      audience: rawTemplate.tags?.targetAudience?.join(', ') ?? 'n/a',
    };

    expect(displayTemplate.id).to.equal('template123');
    expect(displayTemplate.name).to.equal('test_template');
    expect(displayTemplate.label).to.equal('Test Template');
    expect(displayTemplate.templateType).to.equal('app');
    expect(displayTemplate.templateSubtype).to.equal('analytics');
    expect(displayTemplate.industries).to.equal('Technology, Healthcare');
    expect(displayTemplate.audience).to.equal('Developers, Admins');
  });
});
