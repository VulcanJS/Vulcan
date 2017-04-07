import { runCallbacksAsync } from 'meteor/vulcan:core';
import escapeStringRegexp from 'escape-string-regexp';
import { Picker } from 'meteor/meteorhacks:picker';
import Posts from '../collection.js';

Picker.route('/out', ({ query}, req, res, next) => {
  if(query.url){ // for some reason, query.url doesn't need to be decoded
    /*
    If the URL passed to ?url= is in plain text, any hash fragment
    will get stripped out.
    So we search for any post whose URL contains the current URL to get a match
    even without the hash
    */

    // decoce url just in case
    const decodedUrl = decodeURIComponent(query.url);

    try {
      const post = Posts.findOne({url: {$regex: escapeStringRegexp(decodedUrl)}}, {sort: {postedAt: -1, createdAt: -1}});

      if (post) {
        const ip = req.headers && req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        runCallbacksAsync('posts.click.async', post, ip);

        res.writeHead(301, {'Location': query.url});
        res.end();
      } else {
        // don't redirect if we can't find a post for that link
        res.end(`Invalid URL: ${query.url}`);
      }
    } catch (error) {
      console.log('// /out error')
      console.log(error)
      console.log(query)
    }
  } else {
    res.end("Please provide a URL");
  }
});
