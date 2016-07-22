import Posts from '../collection.js';
import escapeStringRegexp from 'escape-string-regexp';

Picker.route('/out', function(params, req, res, next) {
  var query = params.query;
  if(query.url){ // for some reason, query.url doesn't need to be decoded

    /* 
    If the URL passed to ?url= is in plain text, any hash fragment
    will get stripped out.
    So we search for any post whose URL contains the current URL to get a match
    even without the hash
    */
    const post = Posts.findOne({url: {$regex: escapeStringRegexp(query.url)}});

    if (post) {
      var ip = req.headers && req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      Posts.methods.increaseClicks(post._id, ip);
      res.writeHead(301, {'Location': query.url});
      res.end();
    } else {
      // don't redirect if we can't find a post for that link
      res.end('Invalid URL');
    }
  } else {
    res.end("Please provide a URL");
  }
});