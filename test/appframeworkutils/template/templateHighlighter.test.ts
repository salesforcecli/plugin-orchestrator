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
import {
  getStyledValue,
  getStyledObject,
  groupTemplatesByType,
} from '../../../src/utils/template/templateHighlighter.js';
import { TemplateData } from '../../../src/utils/template/templateTypes.js';

describe('templateHighlighter', () => {
  describe('getStyledValue', () => {
    it('should return empty string for null or undefined values', () => {
      expect(getStyledValue('templateType', null)).to.equal('');
      expect(getStyledValue('templateType', undefined)).to.equal('');
    });

    it('should return styled value for known template types', () => {
      const appStyled = getStyledValue('templateType', 'app');
      const componentStyled = getStyledValue('templateType', 'component');

      expect(appStyled).to.include('app');
      expect(componentStyled).to.include('component');

      expect(appStyled).not.to.equal('app');
      expect(componentStyled).not.to.equal('component');
    });

    it('should return the value as-is for unknown properties', () => {
      const value = getStyledValue('unknownproperty', 'somevalue');
      expect(value).to.equal('somevalue');
    });
  });

  describe('getStyledObject', () => {
    it('should apply styling to all string properties', () => {
      const template: TemplateData = {
        name: 'TestTemplate',
        templateType: 'app',
        templateVersion: '1.0',
        templateId: 'test123',
      };

      const styled = getStyledObject(template);

      expect(styled.name).to.equal('TestTemplate');

      expect(styled.templateType).to.include('app');
      expect(styled.templateType).not.to.equal('app');
      expect(styled.templateVersion).to.include('1.0');
      expect(styled.templateVersion).not.to.equal('1.0');

      expect(styled.templateId).to.equal('test123');
    });

    it('should handle objects with non-string properties', () => {
      const template: TemplateData = {
        name: 'TestTemplate',
        templateType: 'component',
        namespace: null,
        created: '1/1/2023',
      };

      const styled = getStyledObject(template);

      expect(styled.namespace).to.be.null;
    });
  });

  describe('groupTemplatesByType', () => {
    it('should group templates by their types', () => {
      const templates: TemplateData[] = [
        { name: 'App1', templateType: 'app' },
        { name: 'App2', templateType: 'app' },
        { name: 'Component1', templateType: 'component' },
        { name: 'Other1', templateType: 'dashboard' },
      ];

      const grouped = groupTemplatesByType(templates);

      expect(grouped.app).to.have.length(2);
      expect(grouped.component).to.have.length(1);
      expect(grouped.other).to.have.length(1);

      expect(grouped.app[0].name).to.equal('App1');
      expect(grouped.app[1].name).to.equal('App2');
      expect(grouped.component[0].name).to.equal('Component1');
      expect(grouped.other[0].name).to.equal('Other1');
    });

    it('should handle empty array', () => {
      const grouped = groupTemplatesByType([]);

      expect(grouped.app).to.be.an('array').that.is.empty;
      expect(grouped.component).to.be.an('array').that.is.empty;
      expect(grouped.other).to.be.an('array').that.is.empty;
    });

    it('should handle templates with missing type', () => {
      const templates: TemplateData[] = [{ name: 'MissingType1' }, { name: 'MissingType2', templateType: undefined }];

      const grouped = groupTemplatesByType(templates);

      expect(grouped.other).to.have.length(2);
      expect(grouped.other[0].name).to.equal('MissingType1');
      expect(grouped.other[1].name).to.equal('MissingType2');
    });
  });
});
