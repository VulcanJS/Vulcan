import escapeStringRegexp from 'escape-string-regexp';
import { addCallback, Utils } from 'meteor/vulcan:lib';

function addSearchQueryParameter (parameters, terms) {
  if(!!terms.query) {
    
    const query = escapeStringRegexp(terms.query);

    parameters = Utils.deepExtend(true, parameters, {
      selector: {
        $or: [
          {username: {$regex: query, $options: 'i'}},
          {email: {$regex: query, $options: 'i'}},
          {displayName: {$regex: query, $options: 'i'}},
          {bio: {$regex: query, $options: 'i'}},
        ]
      }
    });
  }
  return parameters;
}
addCallback("users.parameters", addSearchQueryParameter);
