/* @flow */

import { extractHashtagsWithIndices } from './utils';

export default (contentBlock: Object, callback: Function) => {
  const text = contentBlock.getText();
  const results = extractHashtagsWithIndices(text);

  results.forEach((hashtag) => {
    callback(hashtag.indices[0], hashtag.indices[1]);
  });
};
