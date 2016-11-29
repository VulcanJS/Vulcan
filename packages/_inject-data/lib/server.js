var http = Npm.require('http');

var templateText = Assets.getText('lib/inject.html');
var injectDataTemplate = _.template(templateText);

// custome API
InjectData.pushData = function pushData(res, key, value) {
  if(!res._injectPayload) {
    res._injectPayload = {};
  }

  res._injectPayload[key] = value;
  InjectData._hijackWriteIfNeeded(res);
};

InjectData.getData = function getData(res, key) {
  if(res._injectPayload) {
    return _.clone(res._injectPayload[key]);
  } else {
    return null;
  }
};

InjectData._hijackWriteIfNeeded = function(res) {
//   if(res._writeHijacked) {
//     return;
//   }
//  res._writeHijacked = true;

  var originalWrite = res.write;
  res.write = function(chunk, encoding) {
    var condition =
      res._injectPayload && !res._injected &&
      encoding === undefined &&
      /<!DOCTYPE html>/.test(chunk);

    if(condition) {
      // if cors headers included if may cause some security holes
      // so we simply turn off injecting if we detect an cors header
      // read more: http://goo.gl/eGwb4e
      if(res._headers['access-control-allow-origin']) {
        var warnMessage =
          'warn: injecting data turned off due to CORS headers. ' +
          'read more: http://goo.gl/eGwb4e';

        console.warn(warnMessage);
        originalWrite.call(res, chunk, encoding);
        return;
      }

      // inject data
      var data = InjectData._encode(res._injectPayload);
      var injectHtml = injectDataTemplate({data: data});

      // if this is a buffer, convert it to string
      chunk = chunk.toString();
      chunk = chunk.replace('<script', injectHtml + '<script');

      res._injected = true;
    }

    originalWrite.call(res, chunk, encoding);
  };
};
