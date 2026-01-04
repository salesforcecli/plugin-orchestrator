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

// import { expect } from 'chai';
// import { SfCommand } from '@salesforce/sf-plugins-core';
// import { stubSfCommandUx } from '@salesforce/sf-plugins-core';
// import { TestContext } from '@salesforce/core/testSetup';
// import ansis from 'ansis';
// import { DisplayUtil } from '../../../src/appframeworkutils/display/displayUtil.js';

// describe('DisplayUtil', () => {
//   const $$ = new TestContext();
//   let sfCommandStubs: ReturnType<typeof stubSfCommandUx>;
//   let mockCommand: SfCommand<unknown>;

//   // Sample data for testing
//   type TestItem = {
//     id: string;
//     name: string;
//     description?: string;
//     type: string;
//     createdDate?: string;
//     tags?: string[];
//     children?: TestItem[];
//   };

//   const sampleItems: TestItem[] = [
//     {
//       id: 'item1',
//       name: 'First Item',
//       description: 'This is the first item',
//       type: 'type1',
//       createdDate: '2023-01-01T12:00:00Z',
//       tags: ['tag1', 'tag2'],
//     },
//     {
//       id: 'item2',
//       name: 'Second Item',
//       type: 'type2',
//       createdDate: '2023-02-01T12:00:00Z',
//     },
//   ];

//   beforeEach(() => {
//     sfCommandStubs = stubSfCommandUx($$.SANDBOX);
//     mockCommand = {
//       log: sfCommandStubs.log,
//       table: sfCommandStubs.table,
//       styledHeader: sfCommandStubs.styledHeader,
//     } as unknown as SfCommand<unknown>;
//   });

//   afterEach(() => {
//     $$.restore();
//   });

//   describe('displayList', () => {
//     it('should display a table with item data', () => {
//       DisplayUtil.displayList(mockCommand, sampleItems, {
//         title: 'Test Items',
//         columns: ['ID', 'Name', 'Type'],
//         formatItem: (item) => ({
//           ID: item.id,
//           Name: item.name,
//           Type: item.type,
//         }),
//         sort: { Name: 'asc' },
//       });

//       // Verify the table was called
//       expect(sfCommandStubs.table.calledOnce).to.be.true;

//       // Check table parameters
//       const tableArgs = sfCommandStubs.table.firstCall.args[0];
//       expect(tableArgs.title).to.equal('Test Items');
//       expect(tableArgs.data).to.have.length(2);

//       // Check data formatting
//       const firstRow = tableArgs.data[0];
//       expect(firstRow.ID).to.equal('item1');
//       expect(firstRow.Name).to.equal('First Item');
//       expect(firstRow.Type).to.equal('type1');

//       // Check sorting
//       expect(tableArgs.sort).to.deep.equal({ Name: 'asc' });
//     });

//     it('should display a message when no items found', () => {
//       DisplayUtil.displayList(mockCommand, [], {
//         title: 'Test Items',
//         columns: ['ID', 'Name', 'Type'],
//         formatItem: () => ({}),
//         emptyMessage: 'No test items found.',
//       });

//       expect(sfCommandStubs.log.calledOnce).to.be.true;
//       expect(sfCommandStubs.log.firstCall.args[0]).to.equal('No test items found.');
//       expect(sfCommandStubs.table.called).to.be.false;
//     });

//     it('should display a footer when provided', () => {
//       DisplayUtil.displayList(mockCommand, sampleItems, {
//         title: 'Test Items',
//         columns: ['ID', 'Name'],
//         formatItem: (item) => ({
//           ID: item.id,
//           Name: item.name,
//         }),
//         footer: 'This is a footer message',
//       });

//       // Verify the footer was displayed
//       const logCalls = sfCommandStubs.log.getCalls();
//       expect(logCalls.length).to.equal(2); // Empty line + footer
//       expect(logCalls[1].args[0]).to.equal('This is a footer message');
//     });
//   });

//   describe('displayDetails', () => {
//     it('should display a header and sections', () => {
//       DisplayUtil.displayDetails(mockCommand, sampleItems[0], {
//         header: 'Item Details',
//         sections: [
//           {
//             title: 'Basic Information',
//             formatSection: (item) => [
//               { Property: 'ID', Value: item.id },
//               { Property: 'Name', Value: item.name },
//               { Property: 'Type', Value: item.type },
//             ],
//           },
//           {
//             title: 'Additional Information',
//             formatSection: (item) => [
//               { Property: 'Description', Value: item.description ?? 'n/a' },
//               { Property: 'Created', Value: item.createdDate ? new Date(item.createdDate).toLocaleString() : 'n/a' },
//             ],
//           },
//         ],
//       });

//       // Verify the header was displayed
//       expect(sfCommandStubs.styledHeader.calledOnce).to.be.true;
//       expect(sfCommandStubs.styledHeader.firstCall.args[0]).to.equal('Item Details');

//       // Verify the sections were displayed
//       expect(sfCommandStubs.table.callCount).to.equal(2);

//       // Check section titles
//       const sections = sfCommandStubs.table.getCalls().map((call) => call.args[0].title);
//       expect(sections).to.include('Basic Information');
//       expect(sections).to.include('Additional Information');
//     });

//     it('should skip sections based on condition', () => {
//       DisplayUtil.displayDetails(mockCommand, sampleItems[1], {
//         // Second item has no description
//         header: 'Item Details',
//         sections: [
//           {
//             title: 'Basic Information',
//             formatSection: (item) => [
//               { Property: 'ID', Value: item.id },
//               { Property: 'Name', Value: item.name },
//             ],
//           },
//           {
//             title: 'Description',
//             condition: (item) => !!item.description,
//             formatSection: (item) => [{ Property: 'Description', Value: item.description ?? 'n/a' }],
//           },
//           {
//             title: 'Tags',
//             condition: (item) => !!item.tags?.length,
//             formatSection: (item) => [{ Property: 'Tags', Value: item.tags?.join(', ') ?? 'None' }],
//           },
//         ],
//       });

//       // Only the Basic Information section should be displayed
//       expect(sfCommandStubs.table.callCount).to.equal(1);
//       expect(sfCommandStubs.table.firstCall.args[0].title).to.equal('Basic Information');
//     });
//   });

//   describe('displayPreview', () => {
//     it('should display a limited number of items', () => {
//       // Create a larger sample
//       const largerSample = [...sampleItems];
//       for (let i = 3; i <= 10; i++) {
//         largerSample.push({
//           id: `item${i}`,
//           name: `Item ${i}`,
//           type: 'type1',
//         });
//       }

//       DisplayUtil.displayPreview(mockCommand, largerSample, {
//         title: 'Preview Items',
//         columns: ['ID', 'Name'],
//         formatItem: (item) => ({
//           ID: item.id,
//           Name: item.name,
//         }),
//         maxItems: 3,
//       });

//       // Verify the table was called
//       expect(sfCommandStubs.table.calledOnce).to.be.true;

//       // Check only the first 3 items were displayed
//       const tableArgs = sfCommandStubs.table.firstCall.args[0];
//       expect(tableArgs.data).to.have.length(3);
//       expect(tableArgs.title).to.equal('Preview Items (3 of 10)');

//       // Verify the count message
//       const logCalls = sfCommandStubs.log.getCalls();
//       expect(logCalls.length).to.be.at.least(1);
//       expect(logCalls[1].args[0]).to.include('Showing 3 of 10 items');
//     });
//   });

//   describe('displayTree', () => {
//     it('should display items in a tree structure', () => {
//       const nestedItems: TestItem[] = [
//         {
//           id: 'parent1',
//           name: 'Parent 1',
//           type: 'folder',
//           children: [
//             {
//               id: 'child1',
//               name: 'Child 1',
//               type: 'item',
//             },
//             {
//               id: 'child2',
//               name: 'Child 2',
//               type: 'item',
//               children: [
//                 {
//                   id: 'grandchild1',
//                   name: 'Grandchild 1',
//                   type: 'item',
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           id: 'parent2',
//           name: 'Parent 2',
//           type: 'folder',
//         },
//       ];

//       DisplayUtil.displayTree(mockCommand, nestedItems, {
//         title: 'Nested Items',
//         getLabel: (item) => `${item.name} (${item.type})`,
//         getChildren: (item) => item.children ?? [],
//       });

//       // Verify the header
//       expect(sfCommandStubs.styledHeader.calledOnce).to.be.true;
//       expect(sfCommandStubs.styledHeader.firstCall.args[0]).to.equal('Nested Items');

//       // Verify the log calls for tree items
//       const logCalls = sfCommandStubs.log.getCalls();
//       expect(logCalls.length).to.be.at.least(4); // At least the 4 items

//       // Check the hierarchy formatting
//       expect(logCalls[0].args[0]).to.include('Parent 1');
//       expect(logCalls[1].args[0]).to.include('Child 1');
//       expect(logCalls[1].args[0]).to.include('└─'); // Child indentation
//     });
//   });

//   describe('message display methods', () => {
//     it('should display success message with checkmark', () => {
//       DisplayUtil.displaySuccess(mockCommand, 'Operation completed successfully');

//       expect(sfCommandStubs.log.calledOnce).to.be.true;
//       expect(sfCommandStubs.log.firstCall.args[0]).to.include('✓');
//       expect(sfCommandStubs.log.firstCall.args[0]).to.include('Operation completed successfully');
//     });

//     it('should display warning message with warning icon', () => {
//       DisplayUtil.displayWarning(mockCommand, 'Proceed with caution');

//       expect(sfCommandStubs.log.calledOnce).to.be.true;
//       expect(sfCommandStubs.log.firstCall.args[0]).to.include('⚠');
//       expect(sfCommandStubs.log.firstCall.args[0]).to.include('Proceed with caution');
//     });

//     it('should display info message with info icon', () => {
//       DisplayUtil.displayInfo(mockCommand, 'Here is some information');

//       expect(sfCommandStubs.log.calledOnce).to.be.true;
//       expect(sfCommandStubs.log.firstCall.args[0]).to.include('ℹ');
//       expect(sfCommandStubs.log.firstCall.args[0]).to.include('Here is some information');
//     });
//   });

//   describe('utility methods', () => {
//     it('should colorize types based on a color map', () => {
//       const colorMap = {
//         type1: ansis.greenBright,
//         type2: ansis.blueBright,
//       };

//       const result1 = DisplayUtil.colorizeType('type1', colorMap);
//       const result2 = DisplayUtil.colorizeType('type2', colorMap);
//       const result3 = DisplayUtil.colorizeType('type3', colorMap); // Not in map

//       expect(result1).to.include('type1');
//       expect(result2).to.include('type2');
//       expect(result3).to.include('type3');
//       // Can't easily test the color codes but they should be applied
//     });

//     it('should format dates in different formats', () => {
//       const dateString = '2023-01-15T10:30:45Z';

//       const fullFormat = DisplayUtil.formatDate(dateString, 'full');
//       const dateFormat = DisplayUtil.formatDate(dateString, 'date');
//       const datetimeFormat = DisplayUtil.formatDate(dateString, 'datetime');

//       expect(fullFormat).to.include('2023');
//       expect(dateFormat).to.not.include(':'); // Just date, no time
//       expect(datetimeFormat).to.include(':'); // Date with time
//     });

//     it('should handle null or undefined dates', () => {
//       expect(DisplayUtil.formatDate(null)).to.equal('n/a');
//       expect(DisplayUtil.formatDate(undefined)).to.equal('n/a');
//     });

//     it('should format different property types', () => {
//       expect(DisplayUtil.formatProperty('string')).to.equal('string');
//       expect(DisplayUtil.formatProperty(123)).to.equal('123');
//       expect(DisplayUtil.formatProperty(null)).to.equal('n/a');
//       expect(DisplayUtil.formatProperty(undefined)).to.equal('n/a');
//       expect(DisplayUtil.formatProperty(['a', 'b', 'c'])).to.equal('a, b, c');
//       expect(DisplayUtil.formatProperty([])).to.equal('None');
//       expect(DisplayUtil.formatProperty({ a: 1, b: 2 })).to.equal('{"a":1,"b":2}');
//     });
//   });
// });
