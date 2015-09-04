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

  // if view is not defined, default to "top"
  var view = !!terms.view ? Telescope.utils.dashToCamel(terms.view) : 'top';

  // get query parameters according to current view
  if (typeof Posts.views[view] !== 'undefined')
    parameters = Telescope.utils.deepExtend(true, parameters, Posts.views[view](terms));

  // iterate over postsParameters callbacks
  parameters = Telescope.callbacks.run("postsParameters", parameters, terms);
  
  // console.log(parameters);

  return parameters;
};

// Parameter callbacks

// extend sort to sort posts by _id to break ties
function breakTies (parameters, terms) {
  return Telescope.utils.deepExtend(true, parameters, {options: {sort: {_id: -1}}});
}
Telescope.callbacks.add("postsParameters", breakTies);

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
  if (!parameters.showFuture && !parameters.find.postedAt) {
    parameters.find.postedAt = {$lte: new Date()};
  }
  return parameters;
}
Telescope.callbacks.add("postsParameters", hideFuturePosts);

// if options are not provided, default to "top" sort
function defaultSort (parameters, terms) {
  if (_.isEmpty(parameters.options.sort)) {
    parameters.options.sort = {sort: {sticky: -1, score: -1}};
  }
  return parameters;
}
Telescope.callbacks.add("postsParameters", defaultSort);