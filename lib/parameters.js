// getPostsParameters gives an object containing the appropriate find and options arguments for the subscriptions's Posts.find()

getPostsParameters = function (terms) {

  var maxLimit = 200;

  // console.log(terms)

  // note: using jquery's extend() with "deep" parameter set to true instead of shallow _.extend()
  // see: http://api.jquery.com/jQuery.extend/

  // initialize parameters by extending baseParameters object, to avoid passing it by reference
  var parameters = deepExtend(true, {}, viewParameters.baseParameters);

  // if view is not defined, default to "top"
  var view = !!terms.view ? dashToCamel(terms.view) : 'top';

  // get query parameters according to current view
  if (typeof viewParameters[view] !== 'undefined')
    parameters = deepExtend(true, parameters, viewParameters[view](terms));

  // extend sort to sort posts by _id to break ties
  deepExtend(true, parameters, {options: {sort: {_id: -1}}});

  // if a limit was provided with the terms, add it too (note: limit=0 means "no limit")
  if (typeof terms.limit !== 'undefined') 
    _.extend(parameters.options, {limit: parseInt(terms.limit)});

  // limit to "maxLimit" posts at most when limit is undefined, equal to 0, or superior to maxLimit
  if(!parameters.options.limit || parameters.options.limit == 0 || parameters.options.limit > maxLimit) {
    parameters.options.limit = maxLimit;
  }

  // hide future scheduled posts unless "showFuture" is set to true or postedAt is already defined
  if (!parameters.showFuture && !parameters.find.postedAt)
    parameters.find.postedAt = {$lte: new Date()};

  // console.log(parameters);

  return parameters;
};

getUsersParameters = function(filterBy, sortBy, limit) {
  var find = {},
      sort = {createdAt: -1};

  switch(filterBy){
    case 'invited':
      // consider admins as invited
      find = {$or: [{isInvited: true}, adminMongoQuery]};
      break;
    case 'uninvited':
      find = {$and: [{isInvited: false}, notAdminMongoQuery]};
      break;
    case 'admin':
      find = adminMongoQuery;
      break;
  }

  switch(sortBy){
    case 'username':
      sort = {username: 1};
      break;
    case 'karma':
      sort = {karma: -1};
      break;
    case 'postCount':
      sort = {postCount: -1};
      break;
    case 'commentCount':
      sort = {commentCount: -1};
    case 'invitedCount':
      sort = {invitedCount: -1};
  }
  return {
    find: find, 
    options: {sort: sort, limit: limit}
  };
};
