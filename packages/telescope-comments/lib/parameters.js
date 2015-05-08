/**
 * Gives an object containing the appropriate find
 * and options arguments for the subscriptions's Comments.find()
 * @param {Object} terms
 */
Comments.getSubParams = function (terms) {

  var maxLimit = 200;

  // console.log(terms)

  // note: using jquery's extend() with "deep" parameter set to true instead of shallow _.extend()
  // see: http://api.jquery.com/jQuery.extend/

  // initialize parameters by extending baseParameters object, to avoid passing it by reference
  var parameters = Telescope.utils.deepExtend(true, {}, Comments.views.baseParameters);

  // get query parameters according to current view
  if (typeof Comments.views[terms.view] !== 'undefined')
    parameters = Telescope.utils.deepExtend(true, parameters, Comments.views[terms.view](terms));

  // if a limit was provided with the terms, add it too (note: limit=0 means "no limit")
  if (typeof terms.limit !== 'undefined')
    _.extend(parameters.options, {limit: parseInt(terms.limit)});

  // limit to "maxLimit" posts at most when limit is undefined, equal to 0, or superior to maxLimit
  if(!parameters.options.limit || parameters.options.limit == 0 || parameters.options.limit > maxLimit) {
    parameters.options.limit = maxLimit;
  }

  // console.log(parameters);

  return parameters;
};