InjectData._encode = function(ejson) {
  var ejsonString = EJSON.stringify(ejson);
  return encodeURIComponent(ejsonString);
};

InjectData._decode = function(encodedEjson) {
  var decodedEjsonString = decodeURIComponent(encodedEjson);
  if(!decodedEjsonString) return null;

  return EJSON.parse(decodedEjsonString);
};
