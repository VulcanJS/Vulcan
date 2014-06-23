// getParameters gives an object containing the appropriate find and options arguments for the subscriptions's Posts.find()

getParameters = function (terms) {

  // console.log(terms)

  // note: using jquery's extend() with "deep" parameter set to true instead of shallow _.extend()
  // see: http://api.jquery.com/jQuery.extend/

  var baseParameters = {
    find: {
      status: 2
    },
    options: {
      limit: 10
    }
  };
  var parameters = baseParameters;

  // get query parameters according to current view
  if(typeof viewParameters[terms.view] !== 'undefined')
    parameters = viewParameters[terms.view](terms, baseParameters);

  // sort by _id to break ties
  deepExtend(true, parameters, {options: {sort: {_id: -1}}});

  if(typeof terms.limit != 'undefined' && !!terms.limit)
    _.extend(parameters.options, {limit: parseInt(terms.limit)});

  // if(typeof terms.category != 'undefined' && !!terms.category)
  //   _.extend(parameters.find, {'categories.slug': terms.category});

  // console.log(parameters)

  return parameters;
};

getUsersParameters = function(filterBy, sortBy, limit) {
  var find = {},
      sort = {createdAt: -1};

  switch(filterBy){
    case 'invited':
      // consider admins as invited
      find = {$or: [{isInvited: true}, {isAdmin: true}]};
      break;
    case 'uninvited':
      find = {$and: [{isInvited: false}, {isAdmin: false}]};
      break;
    case 'admin':
      find = {isAdmin: true};
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