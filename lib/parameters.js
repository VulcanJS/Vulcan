
// getParameters gives an object containing the appropriate find and options arguments for the subscriptions's Posts.find()

getParameters = function (view, limit, category, query) {

  // note: using $.extend() with "deep" parameter set to true instead of shallow _.extend()
  // see: http://api.jquery.com/jQuery.extend/

  var baseParameters = {
    find: {
      status: 2
    },
    options: {
      limit: 10
    }
  }

  switch (view) {

    case 'top':
      var parameters = $.extend(true, baseParameters, {options: {sort: {sticky: -1, score: -1}}});
      break;

    case 'new':
      var parameters = $.extend(true, baseParameters, {options: {sort: {sticky: -1, submitted: -1}}});
      break;

    case 'best':
      var parameters = $.extend(true, baseParameters, {options: {sort: {sticky: -1, baseScore: -1}}});
      break;

    case 'pending':
      var parameters = $.extend(true, baseParameters, {find: {status: 1}, options: {sort: {createdAt: -1}}});
      break;      

    case 'category': // same as top for now
      var parameters = $.extend(true, baseParameters, {options: {sort: {sticky: -1, score: -1}}});
      break;

    case 'search': // search results
      if(typeof query != 'undefined' && !!query){
        var parameters = $.extend(true, baseParameters, {
          find: {
            $or: [
              {headline: {$regex: query, $options: 'i'}},
              {url: {$regex: query, $options: 'i'}},
              {body: {$regex: query, $options: 'i'}}
            ]
          }
        });
      }else{
        // if query is empty, just return parameters that will result in an empty collection
        var parameters = {find:{_id: 0}};
      }
      break;

  }



  // sort by _id to break ties
  $.extend(true, parameters, {options: {sort: {_id: -1}}})

  if(typeof limit != 'undefined' && !!limit)
    _.extend(parameters.options, {limit: parseInt(limit)});

  if(typeof category != 'undefined' && !!category)
    _.extend(parameters.find, {'categories.slug': category});

  // console.log(parameters)

  return parameters;
}

// Special case for digest
// TODO: merge back into general getParameters function

getDigestParameters = function (date) {
  var mDate = moment(date);
  var parameters = {
    find: {
      status: 2,
      submitted: {
        $gte: mDate.startOf('day').valueOf(), 
        $lt: mDate.endOf('day').valueOf()
      }
    },
    options: {
      sort: {sticky: -1, baseScore: -1, _id: 1}
    }
  };
  return parameters;
}

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
}