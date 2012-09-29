function prepopulateDatabase(){
  [
    {
        headline: 'The first post ever, a link to Hacker News'
      , url: 'http://news.ycombinator.com/'
      , author: 'Sacha'
      , submitted: new Date(2012, 7, 22).getTime()
      , votes: 0
      , comments: 0
      , score: 0
    }
    , {
        headline: 'Another post to fill the page up a little'
      , url: 'http://sachagreif.com/'
      , author: 'Sacha'
      , submitted: new Date(2012, 7, 23).getTime()
      , votes: 0
      , comments: 0
      , score: 0
    }
  ].forEach(function(post){
    Posts.insert(post);
  });
}

// Meteor.startup(function () {
//   if(Posts.find().count() === 0){
//     prepopulateDatabase();
//   }
// });
