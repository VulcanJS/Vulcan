/**
 * Parameter callbacks let you add parameters to subscriptions 
 * @namespace Posts.parameters
 */
Posts.parameters = {};

/**
 * Takes a set of terms, and translates them into a `parameter` object containing the appropriate find
 * and options arguments for the subscriptions's Posts.find()
 * @param {Object} terms
 */
Posts.parameters.get = function (terms) {

  // add this to ensure all post publications pass audit-arguments-check
  check(terms, Match.Any);

  // console.log(terms)

  // note: using jquery's extend() with "deep" parameter set to true instead of shallow _.extend()
  // see: http://api.jquery.com/jQuery.extend/

  // initialize parameters by extending baseParameters object, to avoid passing it by reference
  var parameters = Telescope.utils.deepExtend(true, {}, Posts.views.baseParameters);

  // iterate over postsParameters callbacks
  parameters = Telescope.callbacks.run("postsParameters", parameters, terms);
  
  // if sort options are not provided, default to "top" sort
  if (_.isEmpty(parameters.options.sort)) {
    parameters.options.sort = {sticky: -1, score: -1};
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

  // if view is not defined, default to "top"
  var view = !!terms.view ? Telescope.utils.dashToCamel(terms.view) : 'top';

  // get query parameters according to current view
  if (typeof Posts.views[view] !== 'undefined')
    parameters = Telescope.utils.deepExtend(true, parameters, Posts.views[view](terms));

  return parameters;
}
Telescope.callbacks.add("postsParameters", addViewParameter);

// View Parameter
// Add "after" and "before" properties to terms which can be used to limit posts in time. 
function addTimeParameter (parameters, terms) {

  if (typeof parameters.find.postedAt === "undefined") {
  
    var postedAt = {};

    if (terms.after) {
      postedAt.$gte = moment(terms.after, "YYYY-MM-DD").startOf('day').toDate();
    }

    if (terms.before) {
      postedAt.$lt = moment(terms.before, "YYYY-MM-DD").endOf('day').toDate();
    }

    if (!_.isEmpty(postedAt)) {
      parameters.find.postedAt = postedAt;
    }

  }

  return parameters;
}
Telescope.callbacks.add("postsParameters", addTimeParameter);

// limit the number of items that can be requested at once
function limitPosts (parameters, terms) {
  var maxLimit = 200;
  // if a limit was provided with the terms, add it too (note: limit=0 means "no limit")
  if (typeof terms.limit !== 'undefined') {
    _.extend(parameters.options, {limit: parseInt(terms.limit)});
  }

  // limit to "maxLimit" items at most when limit is undefined, equal to 0, or superior to maxLimit
  if(!parameters.options.limit || parameters.options.limit === 0 || parameters.options.limit > maxLimit) {
    parameters.options.limit = maxLimit;
  }
  return parameters;
}
Telescope.callbacks.add("postsParameters", limitPosts);

// hide future scheduled posts unless "showFuture" is set to true or postedAt is already defined
function hideFuturePosts (parameters, terms) {

  // var now = new Date();
  var inOneHour = moment().add(1, "hour").toDate();

  if (!parameters.showFuture) {

    if (!!parameters.find.postedAt) {
    
      if (!!parameters.find.postedAt.$lt) {

        // if postedAt.$lt is defined, use it or current date plus one hour, whichever is earlier in time
        var lt = parameters.find.postedAt.$lt;
        parameters.find.postedAt.$lt = lt < inOneHour ? lt : inOneHour;
      
      } else {

        // if postedAt.$lt doesn't exist, use current date plus one hour
       parameters.find.postedAt.$lt = inOneHour;

      }

    } else {

      // if postedAt doesn't exist at all, set it to {$lt: now plus one hour}
      parameters.find.postedAt = { $lt: inOneHour };

    }

  }

  return parameters;
}
Telescope.callbacks.add("postsParameters", hideFuturePosts);