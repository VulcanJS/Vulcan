
// getParameters gives an object containing the appropriate find and options arguments for the subscriptions's Posts.find()

getParameters = function (view, limit, category) {

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

  }

  // sort by _id to break ties
  $.extend(true, parameters, {options: {sort: {_id: -1}}})

  if(typeof limit != 'undefined')
    _.extend(parameters.options, {limit: parseInt(limit)});

  if(typeof category != 'undefined')
    _.extend(parameters.find, {'categories.slug': category});

  // console.log(parameters.options.sort)

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

getUsersParameters = function(filter, limit) {
  var find = {}
  switch(filter){
    case 'invited':
      find = {isInvited: true};
      break;
    case 'uninvited':
      find = {isInvited: false};
      break;
    case 'admin':
      find = {isAdmin: true};
      break;
  }
  return {
    find: find, 
    options: {sort: {createdAt: -1}, limit: limit}
  };
}