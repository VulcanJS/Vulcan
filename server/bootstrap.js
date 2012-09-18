function prepopulateDatabase(){
  [
    {
        headline: 'The first post ever, a link to Hacker News'
      , url: 'http://news.ycombinator.com/'
      , submitter: 'Sacha'
      , submitted: new Date(2012, 7, 22).getTime()
      , votes: 0
      , comments: 0
    }
    , {
        headline: 'Another post to fill the page up a little'
      , url: 'http://sachagreif.com/'
      , submitter: 'Sacha'
      , submitted: new Date(2012, 7, 22).getTime()
      , votes: 0
      , comments: 0
    }
  ].forEach(function(post){
    Posts.insert(post);
  });
}

Meteor.startup(function () {
  if(Posts.find().count() === 0){
    prepopulateDatabase();
  }
});
