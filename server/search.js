logSearch = function (keyword) {
  Searches.insert({
    timestamp: new Date().getTime(),
    keyword: keyword
  });
};