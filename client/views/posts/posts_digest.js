getDateRange= function(pageNumber){
  var now = moment(new Date());
  var dayToDisplay=now.subtract('days', pageNumber-1);
  var range={};
  range.start = dayToDisplay.startOf('day').valueOf();
  range.end = dayToDisplay.endOf('day').valueOf();
  console.log("after: ", dayToDisplay.startOf('day').format("dddd, MMMM Do YYYY, h:mm:ss a"));
  console.log("before: ", dayToDisplay.endOf('day').format("dddd, MMMM Do YYYY, h:mm:ss a"));
  return range;
}

Template.posts_digest.posts = function(){
  return Posts.find();
};

Template.posts_digest.created = function(){
  var postsPerPage=5;
  var pageNumber=Session.get('currentPageNumber') || 1;
  var range=getDateRange(pageNumber);
  var postsView={
    find: {submitted: {$gte: range.start, $lt: range.end}},
    sort: {score: -1},
    skip:0,
    postsPerPage: postsPerPage,
    limit: postsPerPage,
    page: pageNumber
  }
  sessionSetObject('postsView', postsView);
}

Template.posts_digest.events({
  'click .prev-link': function(e) {
    e.preventDefault();
    var postsView=sessionGetObject('postsView');
    postsView.page++;
    var range=getDateRange(postsView.page);
    postsView.find={submitted: {$gte: range.start, $lt: range.end}}
    sessionSetObject('postsView', postsView);
  },
  'click .next-link': function(e) {
    e.preventDefault();
    var postsView=sessionGetObject('postsView');
    if(postsView.page>1){
      postsView.page--;
      var range=getDateRange(postsView.page);
      postsView.find={submitted: {$gte: range.start, $lt: range.end}}
      console.log(postsView.page);
      sessionSetObject('postsView', postsView);
    }
  }
});
