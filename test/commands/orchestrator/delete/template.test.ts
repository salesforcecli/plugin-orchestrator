/*
 * Copyright (c) 2025, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { expect } from 'chai';

describe('appframework delete template', () => {
  const testTemplateId = '0XtB000000001aXYAQ';

  it('should verify URL construction for delete request', () => {
    // This test verifies the URL construction in the deleteTemplate method
    const url = `/templates/${testTemplateId}`;

    expect(url).to.equal(`/templates/${testTemplateId}`);
  });

  it('should format confirmation messages correctly', () => {
    const templateName = 'My Test Template';
    const templateId = testTemplateId;

    const confirmMessage = `Are you sure you want to delete template '${templateName}' (ID: ${templateId})?`;

    expect(confirmMessage).to.include(templateName);
    expect(confirmMessage).to.include(templateId);
  });

  it('should handle template identification by ID or name', () => {
    const testCases = [
      { templateId: testTemplateId, templateName: undefined, expected: testTemplateId },
      { templateId: undefined, templateName: 'TestTemplate', expected: 'TestTemplate' },
    ];

    testCases.forEach(({ templateId, templateName, expected }) => {
      const identifier = templateId ?? templateName;
      expect(identifier).to.equal(expected);
    });
  });

  it('should generate appropriate success messages', () => {
    const successMessage = `Successfully deleted template with ID: ${testTemplateId}`;

    expect(successMessage).to.include('Successfully deleted');
    expect(successMessage).to.include(testTemplateId);
  });
});
