/* @flow */

import findWithRegex from 'find-with-regex';

const EMOJI_REGEX = /(\s|^):[\w]*/g;

export default (contentBlock: Object, callback: Function) => {
  findWithRegex(EMOJI_REGEX, contentBlock, callback);
};
