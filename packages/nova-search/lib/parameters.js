import escapeStringRegexp from 'escape-string-regexp';
import { addCallback, Utils } from 'meteor/nova:core';

function addSearchQueryParameter (parameters, terms) {
  if(!!terms.query) {
    
    const query = escapeStringRegexp(terms.query);

    parameters = Utils.deepExtend(true, parameters, {
      selector: {
        $or: [
          {title: {$regex: query, $options: 'i'}},
          {url: {$regex: query, $options: 'i'}},
          // note: we cannot search the body field because it's not published
          // to the client. If we did, we'd get different result sets on 
          // client and server
          {excerpt: {$regex: query, $options: 'i'}}
        ]
      }
    });
  }
  return parameters;
}
addCallback("posts.parameters", addSearchQueryParameter);
