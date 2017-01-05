import escapeStringRegexp from 'escape-string-regexp';
import { Picker } from 'meteor/meteorhacks:picker';
import Events from 'meteor/nova:events';
import Posts from '../collection.js';

// /**
//  * @summary Increase the number of clicks on a post
//  * @param {string} postId – the ID of the post being edited
//  * @param {string} ip – the IP of the current user
//  */
Posts.increaseClicks = (postId, ip) => {
  const clickEvent = {
    name: 'click',
    properties: {
      postId: postId,
      ip: ip
    }
  };

  // make sure this IP hasn't previously clicked on this post
  const existingClickEvent = Events.findOne({name: 'click', 'properties.postId': postId, 'properties.ip': ip});

  if(!existingClickEvent){
    Events.log(clickEvent);
    return Posts.update(postId, { $inc: { clickCount: 1 }});
  }
};

Picker.route('/out', ({ query}, req, res, next) => {
  if(query.url){ // for some reason, query.url doesn't need to be decoded
    /*
    If the URL passed to ?url= is in plain text, any hash fragment
    will get stripped out.
    So we search for any post whose URL contains the current URL to get a match
    even without the hash
    */
    const post = Posts.findOne({url: {$regex: escapeStringRegexp(query.url)}});

    if (post) {
      const ip = req.headers && req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      Posts.increaseClicks(post._id, ip);
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
