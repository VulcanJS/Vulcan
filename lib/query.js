// build find query object
selectPosts = function(properties){
  var find = {};

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

  console.log("*"+properties.name+"* find query: --------------")
  console.log(find)

  return find;
}

// build sort query object
sortPosts = function(sortProperty){
  var sort = {sort: {sticky: -1}};
  sort.sort[sortProperty] = -1;
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
  return {sort: {baseScore: -1}};
}

findDigestPosts = function(mDate) {
  return Posts.find(selectDigest(mDate), sortDigest());
}
