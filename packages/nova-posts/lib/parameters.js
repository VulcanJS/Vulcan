import { Injected } from 'meteor/meteorhacks:inject-initial';
import moment from 'moment';
import escapeStringRegexp from 'escape-string-regexp';
import { addCallback, Utils } from 'meteor/vulcan:core';

// Add "after" and "before" properties to terms which can be used to limit posts in time.
function addTimeParameter (parameters, terms, apolloClient) {

  // console.log("// addTimeParameter")

  if (typeof parameters.selector.postedAt === "undefined") {

    let postedAt = {}, mAfter, mBefore, startOfDay, endOfDay, clientTimezoneOffset, serverTimezoneOffset, timeDifference;

    /*

    If we're on the client, add the time difference between client and server

    Example: client is on Japanese time (+9 hours),
    server on UCT (Greenwich) time (+0 hours), for a total difference of +9 hours.

    So the time "00:00, UCT" is equivalent to "09:00, JST".

    So if we want to express the timestamp "00:00, UCT" on the client,
    we *add* 9 hours to "00:00, JST" on the client to get "09:00, JST" and
    sync up both times.

    */

    if (Meteor.isClient) {
      clientTimezoneOffset = -1 * new Date().getTimezoneOffset();
      serverTimezoneOffset = -1 * Injected.obj('serverTimezoneOffset').offset;
      timeDifference = clientTimezoneOffset - serverTimezoneOffset;

      // console.log("client time:"+clientTimezoneOffset);
      // console.log("server time:"+serverTimezoneOffset);
      // console.log("difference: "+timeDifference);
    }

    if (terms.after) {

      // console.log("// after: "+terms.after);

      mAfter = moment(terms.after, "YYYY-MM-DD");
      startOfDay = mAfter.startOf('day');

        // console.log("// normal      ", mAfter.toDate(), mAfter.valueOf());
        // console.log("// startOfDay  ", startOfDay.toDate(), startOfDay.valueOf());

      if (Meteor.isClient) {
        startOfDay.add(timeDifference, "minutes");
        // console.log("// after add   ", startOfDay.toDate(), startOfDay.valueOf());
        // note: on the client, dates are stored as strings, 
        // so use strings for MongoDB filtering options too
        postedAt.$gte = startOfDay.toISOString();
      } else {
        postedAt.$gte = startOfDay.toDate();
      }

    }

    if (terms.before) {

      mBefore = moment(terms.before, "YYYY-MM-DD");
      endOfDay = mBefore.endOf('day');

      if (Meteor.isClient) {
        endOfDay.add(timeDifference, "minutes");
        postedAt.$lt = endOfDay.toISOString();
      } else {
        postedAt.$lt = endOfDay.toDate();
      }

    }

    if (!_.isEmpty(postedAt)) {
      parameters.selector.postedAt = postedAt;
    }

  }

  return parameters;
}
addCallback("posts.parameters", addTimeParameter);

// limit the number of items that can be requested at once
function limitPosts (parameters, terms, apolloClient) {
  var maxLimit = 200;

  // 1. set default limit to 10
  let limit = 10;

  // 2. look for limit on terms.limit
  if (terms.limit) {
    limit = parseInt(terms.limit);
  }

  // 3. look for limit on terms.options.limit
  if (terms.options && terms.options.limit) {
    limit = parseInt(terms.options.limit);
  }

  // 4. make sure limit is not greater than 200
  if (limit > maxLimit) {
    limit = maxLimit;
  }

  // 5. initialize parameters.options if needed
  if (!parameters.options) {
    parameters.options = {};
  }

  // 6. set limit
  parameters.options.limit = limit;

  return parameters;
}
addCallback("posts.parameters", limitPosts);

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
