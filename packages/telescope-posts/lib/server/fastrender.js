var getDays = function (daysCount) {
  var daysArray = [];
  // var days = this.days;
  for (var i = 0; i < daysCount; i++) {
    daysArray.push({
      date: moment().subtract(i, 'days').startOf('day').toDate(),
      index: i
    });
  }
  return daysArray;
};

Posts.fastRenderSubscribe = function (params) {

  var fr = this;

  // generate cat array
  var categories = [];
  var index = 0;
  while (!!params.query["cat["+index+"]"]) {
    categories.push(params.query["cat["+index+"]"]);
    delete params.query["cat["+index+"]"];
    index++;
  }

  if (categories.length) {
    params.query.cat = categories;
  }
  
  if (!params.query.limit) {
    params.query.limit = Settings.get('postsPerPage', 10);
  }

  // special case for daily view
  if (params.query.view === "daily") {

    var daysCount = params.days ? params.days : 5;
    var days = getDays(daysCount);

    days.forEach(function (day) {
      
      var subscriptionTerms = {
        view: "top",
        date: day.date,
        after: moment(day.date).format("YYYY-MM-DD"),
        before: moment(day.date).format("YYYY-MM-DD")
      };

      fr.subscribe('postsList', subscriptionTerms);
      fr.subscribe('postsListUsers', subscriptionTerms);

    });


  } else {

    fr.subscribe('postsList', params.query);
    fr.subscribe('postsListUsers', params.query);

  }
};

Meteor.startup(function () {

  FastRender.route("/", Posts.fastRenderSubscribe);
  
  FastRender.route("/posts/:_id/:slug?", function (params) {
    var postId = params._id;
    this.subscribe('singlePost', postId);
    this.subscribe('postUsers', postId);
    this.subscribe('commentsList', {view: 'postComments', postId: postId});
  });

});