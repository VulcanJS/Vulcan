function prepopulateDatabase(){
  [
    {
        headline: 'The first post ever, a link to Hacker News'
      , url: 'http://news.ycombinator.com/'
      , submitter: 'Sacha'
    }
    , {
        headline: 'Another post to fill the page up a little'
      , url: 'http://sachagreif.com/'
      , submitter: 'Sacha'
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
