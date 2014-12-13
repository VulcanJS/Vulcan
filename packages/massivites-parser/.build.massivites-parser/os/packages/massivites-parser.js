(function () {

////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                        //
// packages/massivites-parser/lib/both/routes.coffee.js                                   //
//                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////
                                                                                          //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.startup(function() {
  var AdminParserController;
  Router.onBeforeAction(Router._filters.isAdmin, {
    only: ['parserPage']
  });
  AdminParserController = RouteController.extend({
    template: getTemplate('parserPage'),
    fastRender: true
  });
  return Router.route('/parser', {
    name: 'parserPage',
    controller: AdminParserController
  });
});
////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                        //
// packages/massivites-parser/lib/both/base.coffee.js                                     //
//                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////
                                                                                          //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
adminNav.push({
  route: 'parserPage',
  label: 'Parser'
});
////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                        //
// packages/massivites-parser/lib/server/parseFacebookFeed.coffee.js                      //
//                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////
                                                                                          //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var checkIfNewPost, findOrInsertUser, findUserByFbId, generateUsername;

generateUsername = function(name) {
  return name.toLowerCase().replace(/\s+|\s+/g, "");
};

findUserByFbId = function(fbId) {
  return Meteor.users.findOne({
    "fbData.id": fbId
  });
};

findOrInsertUser = function(fbUserData) {
  var isNewUser, user, userId, username;
  isNewUser = false;
  user = findUserByFbId(fbUserData.id);
  if (user != null) {
    userId = user._id;
  } else {
    isNewUser = true;
    username = generateUsername(fbUserData.name);
    userId = Accounts.createUser({
      username: username,
      email: "" + username + "@massivites.io",
      password: 'letmein',
      profile: {
        name: fbUserData.name
      },
      fbData: {
        id: fbUserData.id,
        name: fbUserData.name
      }
    });
  }
  return {
    userId: userId,
    isNewUser: isNewUser
  };
};

checkIfNewPost = function(fbPostId) {
  var post;
  post = Posts.findOne({
    'fbData.id': fbPostId
  });
  if (post != null) {
    return false;
  } else {
    return true;
  }
};

Meteor.methods({
  parseFacebookFeed: function(jsonFeed) {
    var comment, commentAuthor, commentAuthorId, commentDoc, comments, isNewPost, parserStats, post, postAuthor, postAuthorId, postDb, postDoc, postLikes, posts, user, _i, _j, _len, _len1;
    parserStats = {
      updatedPosts: 0,
      newPosts: 0,
      newUsers: 0,
      updatedUsers: 0,
      changedComments: 0
    };
    posts = EJSON.parse(jsonFeed).data;
    for (_i = 0, _len = posts.length; _i < _len; _i++) {
      post = posts[_i];
      if (post.message == null) {
        break;
      }
      console.log("================ Facebook post id: " + post.id + " ================");
      isNewPost = checkIfNewPost(post.id);
      postAuthor = post.from;
      postAuthorId = (findOrInsertUser(postAuthor)).userId;
      postLikes = post.likes != null ? post.likes.data.length : 0;
      postDoc = {
        author: postAuthor.name,
        body: post.message,
        htmlBody: post.message,
        status: 2,
        upvotes: postLikes,
        baseScore: postLikes,
        downvotes: 0,
        commentCount: 0,
        clickCount: 0,
        viewCount: 0,
        score: 0,
        inactive: false,
        userId: postAuthorId,
        createdAt: post.created_time,
        postedAt: post.created_time,
        fbData: {
          id: post.id
        }
      };
      Posts.update({
        fbData: {
          id: post.id
        }
      }, {
        $set: postDoc
      }, {
        upsert: true
      });
      postDb = Posts.findOne({
        fbData: {
          id: post.id
        }
      });
      if (post.comments != null) {
        comments = post.comments.data;
        parserStats.changedComments += comments.length;
        Posts.update(postDb._id, {
          $set: {
            commentCount: comments.length
          }
        }, {
          validate: false
        });
        for (_j = 0, _len1 = comments.length; _j < _len1; _j++) {
          comment = comments[_j];
          commentAuthor = comment.from;
          user = findOrInsertUser(commentAuthor);
          commentAuthorId = user.userId;
          if (user.isNewUser) {
            parserStats.newUsers += 1;
          } else {
            parserStats.updatedUsers += 1;
          }
          commentDoc = {
            upvotes: comment.like_count,
            downvotes: 0,
            score: 0,
            author: commentAuthor.name,
            body: comment.message,
            htmlBody: comment.message,
            createdAt: comment.created_time,
            postedAt: comment.created_time,
            baseScore: comment.like_count,
            upvotes: comment.like_count,
            postId: postDb._id,
            userId: commentAuthorId,
            fbData: {
              id: comment.id
            }
          };
          Comments.update({
            fbData: {
              id: comment.id
            }
          }, {
            $set: commentDoc
          }, {
            validate: false,
            upsert: true
          });
        }
      }
      if (isNewPost === true) {
        parserStats.newPosts += 1;
        Meteor.users.update(postAuthorId, {
          $inc: {
            postCount: 1
          }
        });
      }
      parserStats.updatedPosts += 1;
    }
    return parserStats;
  }
});
////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);
