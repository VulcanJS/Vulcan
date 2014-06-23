logSearch = function (keyword) {
  Searches.insert({
    timestamp: new Date(),
    keyword: keyword
  });
};