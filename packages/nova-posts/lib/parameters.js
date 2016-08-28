import Telescope from 'meteor/nova:lib';
import Posts from './collection.js'
import moment from 'moment';

/**
 * @summary Parameter callbacks let you add parameters to subscriptions 
 * @namespace Posts.parameters
 */
Posts.parameters = {};

/**
 * @summary Takes a set of terms, and translates them into a `parameter` object containing the appropriate find
 * and options arguments for the subscriptions's Posts.find()
 * @memberof Parameters
 * @param {Object} terms
 */
Posts.parameters.get = function (terms) {

  // add this to ensure all post publications pass audit-arguments-check
  check(terms, Match.Any);

  // console.log(terms)

  // note: using jquery's extend() with "deep" parameter set to true instead of shallow _.extend()
  // see: http://api.jquery.com/jQuery.extend/

  // initialize parameters with empty object
  let parameters = {
    selector: {},
    options: {}
  };

  // iterate over postsParameters callbacks
  parameters = Telescope.callbacks.run("postsParameters", parameters, _.clone(terms));
  
  // if sort options are not provided, default to "createdAt" sort
  if (_.isEmpty(parameters.options.sort)) {
    parameters.options.sort = {sticky: -1, createdAt: -1};
  }
 
  // extend sort to sort posts by _id to break ties
  // NOTE: always do this last to avoid _id sort overriding another sort
  parameters = Telescope.utils.deepExtend(true, parameters, {options: {sort: {_id: -1}}});

  // console.log(parameters);
  
  return parameters;
};

// Parameter callbacks

// View Parameter
// Add a "view" property to terms which can be used to filter posts. 
function addViewParameter (parameters, terms) {

  // if view is not defined, default to "new"
  var view = !!terms.view ? Telescope.utils.dashToCamel(terms.view) : 'new';

  // get query parameters according to current view
  if (typeof Posts.views[view] !== 'undefined')
    parameters = Telescope.utils.deepExtend(true, parameters, Posts.views[view](terms));

  return parameters;
}
Telescope.callbacks.add("postsParameters", addViewParameter);

// View Parameter
// Add "after" and "before" properties to terms which can be used to limit posts in time. 
function addTimeParameter (parameters, terms) {

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
      }

      postedAt.$gte = startOfDay.toDate();
    }

    if (terms.before) {

      mBefore = moment(terms.before, "YYYY-MM-DD");
      endOfDay = mBefore.endOf('day');

      if (Meteor.isClient) {
        endOfDay.add(timeDifference, "minutes");
      }

      postedAt.$lt = endOfDay.toDate();
    
    }

    if (!_.isEmpty(postedAt)) {
      parameters.selector.postedAt = postedAt;
    }

  }

  return parameters;
}
Telescope.callbacks.add("postsParameters", addTimeParameter);

// limit the number of items that can be requested at once
function limitPosts (parameters, terms) {
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
Telescope.callbacks.add("postsParameters", limitPosts);
