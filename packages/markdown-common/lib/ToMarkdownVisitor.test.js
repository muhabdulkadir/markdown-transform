/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// @ts-nocheck
/* eslint-disable no-undef */
'use strict';

const { ModelManager, Factory, Serializer } = require('@accordproject/concerto-core');
const CommonMarkModel = require('./externalModels/CommonMarkModel');
const ToMarkdownVisitor = require('./ToMarkdownVisitor');

const commonmark = {
    '$class':`${CommonMarkModel.NAMESPACE}.Document`,
    'xmlns':'http://commonmark.org/xml/1.0',
    'nodes':[{
        '$class':`${CommonMarkModel.NAMESPACE}.Paragraph`,
        'nodes':[{
            '$class':`${CommonMarkModel.NAMESPACE}.Text`,
            'text':'This is some text.'
        }]
    }]
};
const commonmarkErr = {
    '$class':`${CommonMarkModel.NAMESPACE}.Document`,
    'xmlns':'http://commonmark.org/xml/1.0',
    'nodes':[{
        '$class':`${CommonMarkModel.NAMESPACE}.FOO`,
        'nodes':[{
            '$class':`${CommonMarkModel.NAMESPACE}.Text`,
            'text':'This is some text.'
        }]
    }]
};
const expected = 'This is some text.';

let serializer;
beforeAll(() => {
    const modelManager = new ModelManager({strict: true});
    modelManager.addCTOModel(CommonMarkModel.MODEL, 'commonmark.cto');
    const factory = new Factory(modelManager);
    serializer = new Serializer(factory, modelManager);
});

describe('ToMarkdownVisitor', () => {
    it('#constructor', () => {
        const toMarkdownVisitor = new ToMarkdownVisitor();
        expect(toMarkdownVisitor).toBeTruthy();
    });

    it('#toMarkdown', () => {
        const toMarkdownVisitor = new ToMarkdownVisitor();
        expect(toMarkdownVisitor.toMarkdown(serializer.fromJSON(commonmark))).toEqual(expected);
    });

    it('#toMarkdown (wrong commonmark)', () => {
        const toMarkdownVisitor = new ToMarkdownVisitor();
        expect(() => toMarkdownVisitor.toMarkdown(serializer.fromJSON(commonmarkErr))).toThrow('Type "FOO" is not defined in namespace "org.accordproject.commonmark@0.5.0".');
    });

    it('#toMarkdown (missing rule)', () => {
        const toMarkdownVisitor = new ToMarkdownVisitor();
        toMarkdownVisitor.rules = {};
        expect(() => toMarkdownVisitor.toMarkdown(serializer.fromJSON(commonmark))).toThrow('No rule to handle type Text');
    });
});
