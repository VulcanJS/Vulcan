// Posts Lists
STATUS_PENDING=1;
STATUS_APPROVED=2;
STATUS_REJECTED=3;

// put it all together with pagination
postListSubscription = function(find, options, per_page) {
  var handle = Meteor.subscribeWithPagination('paginatedPosts', find, options, per_page);
  handle.fetch = function() {
    var ourFind = _.isFunction(find) ? find() : find;
    return limitDocuments(Posts.find(ourFind, options), handle.loaded());
  }
  return handle;
}

// build find query object
selectPosts = function(properties){
  var find = {};
  find.status = 2; // default to showing approved posts

  if(typeof properties !== "undefined"){

    // Status
    if(properties.status)
      find = _.extend(find, {status: properties.status});

    // Slug
    if(properties.slug)
      find = _.extend(find, {'categories.slug': properties.slug});
    
    // Date
    if(properties.date){
      find = _.extend(find, {submitted: 
        {
          $gte: moment(properties.date).startOf('day').valueOf(), 
          $lt: moment(properties.date).endOf('day').valueOf()
        }
      });
    }

  }

  return find;
}

// build sort query object
sortPosts = function(sortProperty){
  var sort = {sort: {sticky: -1}};
  sort.sort[sortProperty] = -1;
  sort.sort._id = 1;
  return sort;
}

selectDigest = function(mDate) {
  return _.extend({
    submitted: {
      $gte: mDate.startOf('day').valueOf(), 
      $lt: mDate.endOf('day').valueOf()
    }
  }, selectPosts({status: STATUS_APPROVED}));
}

sortDigest = function() {
  return {sort: {baseScore: -1, _id: 1}};
}

findDigestPosts = function(mDate) {
  return Posts.find(selectDigest(mDate), sortDigest());
}
