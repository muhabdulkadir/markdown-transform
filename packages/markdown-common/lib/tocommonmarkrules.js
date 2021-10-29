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

'use strict';

const {
    unescapeCodeBlock,
    parseHtmlBlock,
    headingLevel,
    getAttr,
    trimEndline,
} = require('./CommonMarkUtils');
const NS_PREFIX_CommonMarkModel = require('./externalModels/CommonMarkModel').NS_PREFIX_CommonMarkModel;

// Inline rules
const textRule = {
    tag: NS_PREFIX_CommonMarkModel + 'Text',
    leaf: true,
    open: false,
    close: false,
    enter: (node,token,callback) => { node.text = token.content; },
    skipEmpty: true,
};
const codeInlineRule = {
    tag: NS_PREFIX_CommonMarkModel + 'Code',
    leaf: true,
    open: false,
    close: false,
    enter: (node,token,callback) => { node.text = token.content; },
    skipEmpty: false,
};
const softbreakRule = {
    tag: NS_PREFIX_CommonMarkModel + 'Softbreak',
    leaf: true,
    open: false,
    close: false,
    skipEmpty: false,
};
const hardbreakRule = {
    tag: NS_PREFIX_CommonMarkModel + 'Linebreak',
    leaf: true,
    open: false,
    close: false,
    skipEmpty: false,
};
const htmlInlineRule = {
    tag: NS_PREFIX_CommonMarkModel + 'HtmlInline',
    leaf: true,
    open: false,
    close: false,
    enter: (node,token,callback) => {
        node.text = token.content;
        node.tag = parseHtmlBlock(token.content);
    },
    skipEmpty: false,
};
const strongOpenRule = {
    tag: NS_PREFIX_CommonMarkModel + 'Strong',
    leaf: false,
    open: true,
    close: false,
    skipEmpty: false,
};
const strongCloseRule = {
    tag: NS_PREFIX_CommonMarkModel + 'Strong',
    leaf: false,
    open: false,
    close: true,
    skipEmpty: false,
};
const emphOpenRule = {
    tag: NS_PREFIX_CommonMarkModel + 'Emph',
    leaf: false,
    open: true,
    close: false,
    skipEmpty: false,
};
const emphCloseRule = {
    tag: NS_PREFIX_CommonMarkModel + 'Emph',
    leaf: false,
    open: false,
    close: true,
    skipEmpty: false,
};
const strikethroughOpenRule = {
    tag: NS_PREFIX_CommonMarkModel + 'Strikethrough',
    leaf: false,
    open: true,
    close: false,
    skipEmpty: false,
};
const strikethroughCloseRule = {
    tag: NS_PREFIX_CommonMarkModel + 'Strikethrough',
    leaf: false,
    open: false,
    close: true,
    skipEmpty: false,
};
const underlineOpenRule = {
    tag: NS_PREFIX_CommonMarkModel + 'Underline',
    leaf: false,
    open: true,
    close: false,
    skipEmpty: false,
};
const underlineCloseRule = {
    tag: NS_PREFIX_CommonMarkModel + 'Underline',
    leaf: false,
    open: false,
    close: true,
    skipEmpty: false,
};
const linkOpenRule = {
    tag: NS_PREFIX_CommonMarkModel + 'Link',
    leaf: false,
    open: true,
    close: false,
    enter: (node,token,callback) => {
        node.destination = getAttr(token.attrs,'href','');
        node.title = getAttr(token.attrs,'title','');
    },
    skipEmpty: false,
};
const linkCloseRule = {
    tag: NS_PREFIX_CommonMarkModel + 'Link',
    leaf: false,
    open: false,
    close: true,
    skipEmpty: false,
};
const imageRule = {
    tag: NS_PREFIX_CommonMarkModel + 'Image',
    leaf: false,
    open: true,
    close: true,
    enter: (node,token,callback) => {
        node.destination = getAttr(token.attrs,'src','');
        node.title = getAttr(token.attrs,'title','');
        node.nodes = callback(token.children);
    },
    skipEmpty: false,
};
const spanOpenRule = {
    tag: NS_PREFIX_CommonMarkModel + 'Span',
    leaf: false,
    open: true,
    close: false,
    enter: (node,token,callback) => {
    },
    skipEmpty: false,
};
const spanCloseRule = {
    tag: NS_PREFIX_CommonMarkModel + 'Span',
    leaf: false,
    open: false,
    close: true,
    skipEmpty: false,
};

// Block rules
const codeBlockRule = {
    tag: NS_PREFIX_CommonMarkModel + 'CodeBlock',
    leaf: true,
    open: false,
    close: false,
    enter: (node,token,callback) => {
        const info = token.info.trim();
        node.info = info ? info : null;
        node.tag = parseHtmlBlock(info);
        node.text = token.content ? unescapeCodeBlock(token.content) : '';
    },
};
const fenceRule = codeBlockRule;
const htmlBlockRule = {
    tag: NS_PREFIX_CommonMarkModel + 'HtmlBlock',
    leaf: true,
    open: false,
    close: false,
    enter: (node,token,callback) => {
        const content = trimEndline(token.content);
        node.tag = parseHtmlBlock(content);
        node.text = content;
    },
};
const hrRule = {
    tag: NS_PREFIX_CommonMarkModel + 'ThematicBreak',
    leaf: true,
    open: false,
    close: false,
    enter: (node,token,callback) => {
    },
};
const paragraphOpenRule = {
    tag: NS_PREFIX_CommonMarkModel + 'Paragraph',
    leaf: false,
    open: true,
    close: false,
    enter: (node,token,callback) => {
    },
};
const paragraphCloseRule = {
    tag: NS_PREFIX_CommonMarkModel + 'Paragraph',
    leaf: false,
    open: false,
    close: true,
};
const headingOpenRule = {
    tag: NS_PREFIX_CommonMarkModel + 'Heading',
    leaf: false,
    open: true,
    close: false,
    enter: (node,token,callback) => {
        node.level = headingLevel(token.tag);
    },
};
const headingCloseRule = {
    tag: NS_PREFIX_CommonMarkModel + 'Heading',
    leaf: false,
    open: false,
    close: true,
};
const blockQuoteOpenRule = {
    tag: NS_PREFIX_CommonMarkModel + 'BlockQuote',
    leaf: false,
    open: true,
    close: false,
    enter: (node,token,callback) => {
    },
};
const blockQuoteCloseRule = {
    tag: NS_PREFIX_CommonMarkModel + 'BlockQuote',
    leaf: false,
    open: false,
    close: true,
};
const bulletListOpenRule = {
    tag: NS_PREFIX_CommonMarkModel + 'List',
    leaf: false,
    open: true,
    close: false,
    enter: (node,token,callback) => {
        node.type = 'bullet';
        node.tight = 'true'; // XXX Default but can be overridden when closing the list tag
    },
};
const bulletListCloseRule = {
    tag: NS_PREFIX_CommonMarkModel + 'List',
    leaf: false,
    open: false,
    close: true,
};
const orderedListOpenRule = {
    tag: NS_PREFIX_CommonMarkModel + 'List',
    leaf: false,
    open: true,
    close: false,
    enter: (node,token,callback) => {
        node.type = 'ordered';
        node.start = getAttr(token.attrs,'start','1');
        node.tight = 'true'; // XXX Default but can be overridden when closing the list tag
        node.delimiter = token.markup === ')' ? 'paren' : 'period';
    },
};
const orderedListCloseRule = {
    tag: NS_PREFIX_CommonMarkModel + 'List',
    leaf: false,
    open: false,
    close: true,
};
const listItemOpenRule = {
    tag: NS_PREFIX_CommonMarkModel + 'Item',
    leaf: false,
    open: true,
    close: false,
    enter: (node,token,callback) => {
    },
};
const listItemCloseRule = {
    tag: NS_PREFIX_CommonMarkModel + 'List',
    leaf: false,
    open: false,
    close: true,
};
const tableOpenRule = {
    tag: NS_PREFIX_CommonMarkModel + 'Table',
    leaf: false,
    open: true,
    close: false,
    enter: (node,token,callback) => {
    },
};
const tableCloseRule = {
    tag: NS_PREFIX_CommonMarkModel + 'Table',
    leaf: false,
    open: false,
    close: true,
    exit: (node,token,callback) => {
        const head = node.nodes ? [node.nodes[0].head] : []; // Should only be in first node
        const body = node.nodes ? node.nodes[1].body : []; // Should only be in second node
        node.head = head;
        node.body = body;
        node.nodes = [];
        node.compact = true;
    }
};
const theadOpenRule = {
    tag: NS_PREFIX_CommonMarkModel + 'TableHead',
    leaf: false,
    open: true,
    close: false,
    enter: (node,token,callback) => {
    },
};
const theadCloseRule = {
    tag: NS_PREFIX_CommonMarkModel + 'TableHead',
    leaf: false,
    open: false,
    close: true,
    exit: (node,token,callback) => {
        node.head = node.nodes ? node.nodes[0] : []; // Should only be one
        node.nodes = []; // Reset children (now in head)
    }
};
const tbodyOpenRule = {
    tag: NS_PREFIX_CommonMarkModel + 'TableBody',
    leaf: false,
    open: true,
    close: false,
    enter: (node,token,callback) => {
    },
};
const tbodyCloseRule = {
    tag: NS_PREFIX_CommonMarkModel + 'TableBody',
    leaf: false,
    open: false,
    close: true,
    exit: (node,token,callback) => {
        node.body = node.nodes ? node.nodes : [];
        node.nodes = []; // Reset children (now in body)
    }
};
const trOpenRule = {
    tag: NS_PREFIX_CommonMarkModel + 'TableRow',
    leaf: false,
    open: true,
    close: false,
    enter: (node,token,callback) => {
    },
};
const trCloseRule = {
    tag: NS_PREFIX_CommonMarkModel + 'TableRow',
    leaf: false,
    open: false,
    close: true,
};
const thOpenRule = {
    tag: NS_PREFIX_CommonMarkModel + 'TableHeader',
    leaf: false,
    open: true,
    close: false,
    enter: (node,token,callback) => {
    },
};
const thCloseRule = {
    tag: NS_PREFIX_CommonMarkModel + 'TableHeader',
    leaf: false,
    open: false,
    close: true,
};
const tdOpenRule = {
    tag: NS_PREFIX_CommonMarkModel + 'TableData',
    leaf: false,
    open: true,
    close: false,
    enter: (node,token,callback) => {
    },
};
const tdCloseRule = {
    tag: NS_PREFIX_CommonMarkModel + 'TableData',
    leaf: false,
    open: false,
    close: true,
};

const rules = { inlines: {}, blocks: {}};
rules.inlines.text = textRule;
rules.inlines.code_inline = codeInlineRule;
rules.inlines.softbreak = softbreakRule;
rules.inlines.hardbreak = hardbreakRule;
rules.inlines.html_inline = htmlInlineRule;
rules.inlines.strong_open = strongOpenRule;
rules.inlines.strong_close = strongCloseRule;
rules.inlines.em_open = emphOpenRule;
rules.inlines.em_close = emphCloseRule;
rules.inlines.s_open = strikethroughOpenRule;
rules.inlines.s_close = strikethroughCloseRule;
rules.inlines.u_open = underlineOpenRule;
rules.inlines.u_close = underlineCloseRule;
rules.inlines.link_open = linkOpenRule;
rules.inlines.link_close = linkCloseRule;
rules.inlines.image = imageRule;
rules.inlines.span_open = spanOpenRule;
rules.inlines.span_close = spanCloseRule;

rules.blocks.code_block = codeBlockRule;
rules.blocks.fence = fenceRule;
rules.blocks.html_block = htmlBlockRule;
rules.blocks.hr = hrRule;
rules.blocks.paragraph_open = paragraphOpenRule;
rules.blocks.paragraph_close = paragraphCloseRule;
rules.blocks.heading_open = headingOpenRule;
rules.blocks.heading_close = headingCloseRule;
rules.blocks.blockquote_open = blockQuoteOpenRule;
rules.blocks.blockquote_close = blockQuoteCloseRule;
rules.blocks.bullet_list_open = bulletListOpenRule;
rules.blocks.bullet_list_close = bulletListCloseRule;
rules.blocks.ordered_list_open = orderedListOpenRule;
rules.blocks.ordered_list_close = orderedListCloseRule;
rules.blocks.list_item_open = listItemOpenRule;
rules.blocks.list_item_close = listItemCloseRule;
rules.blocks.table_open = tableOpenRule;
rules.blocks.table_close = tableCloseRule;
rules.blocks.thead_open = theadOpenRule;
rules.blocks.thead_close = theadCloseRule;
rules.blocks.tbody_open = tbodyOpenRule;
rules.blocks.tbody_close = tbodyCloseRule;
rules.blocks.tr_open = trOpenRule;
rules.blocks.tr_close = trCloseRule;
rules.blocks.th_open = thOpenRule;
rules.blocks.th_close = thCloseRule;
rules.blocks.td_open = tdOpenRule;
rules.blocks.td_close = tdCloseRule;

module.exports = rules;
