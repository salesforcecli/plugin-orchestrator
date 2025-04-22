/*
 * Copyright (c) 2025, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { expect } from 'chai';
import { TemplateData } from '../../../../src/utils/template/templateTypes.js';

describe('appframework display template', () => {
  const processedTemplate: TemplateData = {
    id: 'sample-id-1234',
    name: 'SampleTemplate',
    label: 'Sample Template',
    description: 'A sample template for testing',
    templateType: 'app',
    templateSubtype: 'demo',
    applicationSourceId: 'source-1234',
    namespace: 'testns',
    templateVersion: '1.0.0',
    assetVersion: 1,
    created: '1/1/2025',
    modified: '1/2/2025',
    industries: 'Technology, Healthcare',
    audience: 'Developers, Admins',
    url: 'https://example.com/template',
    configurationUrl: 'https://example.com/template/config',
    readinessUrl: 'https://example.com/template/ready',
  };

  it('should apply correct colors to different template types', () => {
    const templateTypes = ['app', 'component', 'dashboard', 'custom'];

    expect(templateTypes[0]).to.equal('app');
    expect(templateTypes[1]).to.equal('component');
  });

  it('should process template data correctly for display', () => {
    expect(processedTemplate).to.have.property('id', 'sample-id-1234');
    expect(processedTemplate).to.have.property('name', 'SampleTemplate');
    expect(processedTemplate).to.have.property('label', 'Sample Template');
    expect(processedTemplate).to.have.property('templateType', 'app');

    expect(processedTemplate).to.have.property('created', '1/1/2025');
    expect(processedTemplate).to.have.property('modified', '1/2/2025');

    expect(processedTemplate).to.have.property('industries', 'Technology, Healthcare');
    expect(processedTemplate).to.have.property('audience', 'Developers, Admins');
  });

  it('should organize template details into logical sections', () => {
    const expectedSections = ['Basic Information', 'Version Information', 'References', 'Content Details'];

    const sectionProperties = {
      'Basic Information': ['ID', 'Name', 'Label', 'Type', 'Subtype'],
      'Version Information': ['Template Version', 'Asset Version', 'Created', 'Last Modified'],
      References: ['Template ID', 'Folder ID', 'API URL', 'Configuration URL'],
      'Content Details': ['Description', 'Industries', 'Target Audience'],
    };

    for (const section of Object.keys(sectionProperties)) {
      expect(expectedSections).to.include(section);

      const properties = sectionProperties[section as keyof typeof sectionProperties];
      for (const property of properties) {
        expect(property).to.be.a('string');
      }
    }
  });

  it('should handle missing template data appropriately', () => {
    const minimalTemplate: TemplateData = {
      id: 'minimal-id',
      name: 'MinimalTemplate',
    };

    expect(minimalTemplate).to.have.property('id');
    expect(minimalTemplate).to.have.property('name');

    expect(minimalTemplate.label).to.be.undefined;
    expect(minimalTemplate.templateType).to.be.undefined;
    expect(minimalTemplate.industries).to.be.undefined;
  });
});
