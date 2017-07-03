import { Picker } from 'meteor/meteorhacks:picker';
import Posts from 'meteor/vulcan:posts';
import Comments from 'meteor/vulcan:comments';

//Route for redirecting LessWrong legacy posts
// addRoute({ name: 'lessWrongLegacy', path: 'lw/:id/:slug/:commentId', componentName: 'LegacyPostRedirect'});


// Route for old post links
Picker.route('/lw/:id/:slug', (params, req, res, next) => {
  if(params.id){

    try {
      const post = Posts.findOne({"legacyData.url": {$regex: "\/lw\/"+params.id+"\/.*"}});

      if (post) {
        res.writeHead(301, {'Location': Posts.getPageUrl(post)});
        res.end();
      } else {
        // don't redirect if we can't find a post for that link
        res.end(`No legacy post found with: ${params}`);
      }
    } catch (error) {
      console.log('// Legacy Post error')
      console.log(error)
      console.log(params)
    }
  } else {
    res.end("Please provide a URL");
  }
});

// Route for old comment links
Picker.route('/lw/:id/:slug/:commentId', (params, req, res, next) => {
  if(params.id){

    try {
      const post = Posts.findOne({"legacyData.url": {$regex: "\/lw\/"+params.id+"\/.*"}});
      const comment = Comments.findOne({"legacyId": parseInt(params.commentId, 36).toString()});
      if (post && comment) {
        res.writeHead(301, {'Location': Posts.getPageUrl(post)+"#"+comment._id});
        res.end();
      } else if (post) {
        res.writeHead(301, {'Location': Posts.getPageUrl(post)});
        res.end();
      } else {
        // don't redirect if we can't find a post for that link
        res.end(`No legacy post found with: ${params}`);
      }
    } catch (error) {
      console.log('// Legacy Post error')
      console.log(error)
      console.log(params)
    }
  } else {
    res.end("Please provide a URL");
  }
});
