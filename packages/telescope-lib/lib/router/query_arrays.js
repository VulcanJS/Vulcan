FlowRouter.addToQueryArray = function (key, value) {
  var keyArray = FlowRouter.getQueryParam(key) || [];
  keyArray.push(value);
  var params = {};
  params[key] = keyArray;
  FlowRouter.setQueryParams(params);
}

FlowRouter.removeFromQueryArray = function (key, value) {
  var keyArray = FlowRouter.getQueryParam(key);
  keyArray = _.without(keyArray, value);
  var params = {};
  params[key] = keyArray;
  FlowRouter.setQueryParams(params);
}