// Very simple function to serve a particular function at a particular URL

// The request's path has to be _exactly_ path. 
// Sure, we could make it smarter, but I'm guessing this isn't the way things 
// will work long term.
Meteor.serve = function(path, fn) {
var connect = (typeof(Npm) == "undefined") ? __meteor_bootstrap__.require("connect") : Npm.require("connect");
  __meteor_bootstrap__.app
    .use(connect.query()) // <- XXX: we can probably assume accounts did this
    .use(function(req, res, next) {
      var test = ('/' + path);
      if (req.url.substring(0, test.length) !== test)
        return next();
      
      // just run fn() and return it to the requester
      res.end(fn(req))
    });
}
