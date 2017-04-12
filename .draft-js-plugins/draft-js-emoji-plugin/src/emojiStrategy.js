import findWithRegex from 'find-with-regex';
import emojione from 'emojione';

const unicodeRegex = new RegExp(emojione.unicodeRegexp, 'g');

export default (contentBlock: Object, callback: Function) => {
  findWithRegex(unicodeRegex, contentBlock, callback);
};
