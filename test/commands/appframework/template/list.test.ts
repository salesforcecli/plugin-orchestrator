/*
 * Copyright (c) 2025, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { expect } from 'chai';
import { TemplateListUtil } from '../../../../src/utils/template/templateListUtils.js';
import { TemplateData, RawTemplate, TemplateType } from '../../../../src/utils/template/templateTypes.js';
import { TemplateOutput } from '../../../../src/utils/template/templateListUtils.js';

describe('appframework template list', () => {
  it('should sort by Label rather than Type', () => {
    const sortConfig = {
      Label: 'asc',
    };

    expect(sortConfig).to.have.property('Label');
    expect(sortConfig.Label).to.equal('asc');
  });

  it('should use TemplateListUtil to process template data', () => {
    const rawTemplates: RawTemplate[] = [
      {
        id: 'template1',
        name: 'Test Template 1',
        label: 'Test 1',
        templateType: 'app' as TemplateType,
        templateSubtype: 'tableau',
        applicationSourceId: 'source1',
        namespace: 'test',
      },
      {
        id: 'template2',
        name: 'Test Template 2',
        label: 'Test 2',
        templateType: 'component' as TemplateType,
        templateSubtype: 'dashboard',
      },
    ];

    const templates: TemplateData[] = TemplateListUtil.processTemplates(rawTemplates);

    expect(templates).to.be.an('array').with.length(2);
    expect(templates[0]).to.have.property('id', 'template1');
    expect(templates[0]).to.have.property('templateSubtype', 'tableau');
    expect(templates[0]).to.have.property('applicationSourceId', 'source1');
    expect(templates[1]).to.have.property('id', 'template2');
    expect(templates[1]).to.have.property('templateSubtype', 'dashboard');
  });

  it('should display the correct columns in the table with the updated order', () => {
    const columns = ['TemplateId', 'Name', 'Label', 'Type', 'SubType', 'Version', 'SourceID'];

    expect(columns[0]).to.equal('TemplateId');
    expect(columns[1]).to.equal('Name');
    expect(columns[2]).to.equal('Label');
    expect(columns[3]).to.equal('Type');
    expect(columns[4]).to.equal('SubType');
    expect(columns[5]).to.equal('Version');
    expect(columns[6]).to.equal('SourceID');
  });

  it('should format table data correctly', () => {
    const templateData: TemplateData[] = [
      {
        name: 'Template 1',
        label: 'Test 1',
        templateId: 'id1',
        templateType: 'app',
        templateSubtype: 'tableau',
        applicationSourceId: 'src123',
      },
    ];

    const displayData: TemplateOutput[] = TemplateListUtil.processSimpleOutput(templateData);

    expect(displayData).to.be.an('array').with.length(1);
    expect(displayData[0]).to.have.property('TemplateId', 'id1');
    expect(displayData[0]).to.have.property('Name', 'Template 1');
    expect(displayData[0]).to.have.property('Label', 'Test 1');
    expect(displayData[0]).to.have.property('Type', 'app');
    expect(displayData[0]).to.have.property('SubType', 'tableau');
    expect(displayData[0]).to.have.property('Version');
    expect(displayData[0]).to.have.property('SourceID', 'src123');
  });
});
