/*
 * Copyright (c) 2025, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { expect } from 'chai';
import { TemplateData, RawTemplate } from '../../../../src/utils/template/templateTypes.js';

/**
 * Tests for the display template functionality
 *
 * These tests focus on the display of template data
 */
describe('orchestrator display template', () => {
  /**
   * Test the display of template data
   */
  it('should display formatted template data', () => {
    // Sample template data to display
    const rawTemplate: RawTemplate = {
      id: '0XtB000000001aXYAQ',
      name: 'SampleTemplate',
      label: 'Sample Template',
      description: 'A sample template for testing display functionality',
      templateType: 'dashboard',
      createdDate: '2023-01-01T00:00:00Z',
      lastModifiedDate: '2023-01-02T00:00:00Z',
      tags: {
        industries: ['Retail', 'Manufacturing'],
        targetAudience: ['Sales', 'Marketing'],
      },
    };

    // Process the raw template into displayable data
    const displayTemplate: TemplateData = {
      id: rawTemplate.id,
      name: rawTemplate.name,
      label: rawTemplate.label,
      description: rawTemplate.description,
      templateType: rawTemplate.templateType,
      created: rawTemplate.createdDate ? new Date(rawTemplate.createdDate).toLocaleDateString() : undefined,
      modified: rawTemplate.lastModifiedDate ? new Date(rawTemplate.lastModifiedDate).toLocaleDateString() : undefined,
      industries: rawTemplate.tags?.industries?.join(', ') ?? 'n/a',
      audience: rawTemplate.tags?.targetAudience?.join(', ') ?? 'n/a',
    };

    // Verify the display template has expected properties and formatting
    expect(displayTemplate.id).to.equal('0XtB000000001aXYAQ');
    expect(displayTemplate.name).to.equal('SampleTemplate');
    expect(displayTemplate.label).to.equal('Sample Template');
    expect(displayTemplate.description).to.equal('A sample template for testing display functionality');
    expect(displayTemplate.templateType).to.equal('dashboard');
    expect(displayTemplate.created).to.be.a('string');
    expect(displayTemplate.modified).to.be.a('string');
    expect(displayTemplate.industries).to.equal('Retail, Manufacturing');
    expect(displayTemplate.audience).to.equal('Sales, Marketing');
  });
});
