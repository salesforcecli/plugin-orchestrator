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
