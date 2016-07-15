import Posts from '../collection.js';

Picker.route('/out', function(params, req, res, next) {
  var query = params.query;
  if(query.url){ // for some reason, query.url doesn't need to be decoded
    var post = Posts.findOne({url: query.url});
    if (post) {
      var ip = req.connection.remoteAddress;
      Posts.methods.increaseClicks(post._id, ip);
      res.writeHead(302, {'Location': query.url});
      res.end();
    } else {
      // don't redirect if we can't find a post for that link
      res.end('Invalid URL');
    }
  } else {
    res.end("Please provide a URL");
  }
});