var logSearch = function (keyword) {
  Searches.insert({
    timestamp: new Date(),
    keyword: keyword
  });
};

Meteor.methods({
  logSearch: function (keyword) {
    logSearch.call(this, keyword);
  }
});