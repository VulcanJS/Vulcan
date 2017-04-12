/* @flow */

import findWithRegex from 'find-with-regex';
import escapeRegExp from 'lodash.escaperegexp';

export default (trigger: string, regExp: string) => (contentBlock: Object, callback: Function) => {
  findWithRegex(new RegExp(`(\\s|^)${escapeRegExp(trigger)}${regExp}`, 'g'), contentBlock, callback);
};
