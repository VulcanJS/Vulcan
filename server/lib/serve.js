// Very simple function to serve a particular function at a particular URL

// The request's path has to be _exactly_ path. 
// Sure, we could make it smarter, but I'm guessing this isn't the way things 
// will work long term.
Meteor.serve = function(path, fn) {
  var connect = __meteor_bootstrap__.require("connect");
  __meteor_bootstrap__.app
    .use(connect.query()) // <- XXX: we can probably assume accounts did this
    .use(function(req, res, next) {
      if (req.url !== '/' + path)
        return next();
      
      // just run fn() and return it to the requester
      res.end(fn())
    });
}
