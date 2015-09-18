var increasePostClicks = function(postId, ip){

  var clickEvent = {
    name: 'click',
    properties: {
      postId: postId,
      ip: ip
    }
  };

  // make sure this IP hasn't previously clicked on this post
  var existingClickEvent = Events.findOne({name: 'click', 'properties.postId': postId, 'properties.ip': ip});

  if(!existingClickEvent){
    Events.log(clickEvent);
    Posts.update(postId, { $inc: { clickCount: 1 }});
  }
};

Picker.route('/out', function(params, req, res, next) {
  var query = params.query;
  if(query.url){ // for some reason, query.url doesn't need to be decoded
    var post = Posts.findOne({url: query.url});
    if (post) {
      var ip = req.connection.remoteAddress;
      increasePostClicks(post._id, ip);
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