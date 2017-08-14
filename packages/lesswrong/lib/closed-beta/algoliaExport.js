import Posts from 'meteor/vulcan:posts';
import Comments from 'meteor/vulcan:comments';
import Users from 'meteor/vulcan:users';
import RSSFeeds from '../collections/rssfeeds/collection.js';
import algoliasearch from 'algoliasearch';
import { getSetting } from 'meteor/vulcan:core';

const runExport = false;

const runPostExport = false;
const runCommentExport = false;
const runUserExport = false;

function commentToAlgoliaComment(comment) {
  const algoliaComment = {
    objectID: comment._id,
    _id: comment._id,
    userId: comment.userId,
    baseScore: comment.baseScore,
    score: comment.score,
    isDeleted: comment.isDeleted,
    retracted: comment.retracted,
    deleted: comment.deleted,
    spam: comment.spam,
    legacy: comment.legacy,
    userIP: comment.userIP,
    createdAt: comment.createdAt,
    postedAt: comment.postedAt,
  };
  const commentAuthor = Users.findOne({_id: comment.userId});
  if (commentAuthor) {
    algoliaComment.authorDisplayName = commentAuthor.displayName;
    algoliaComment.authorUserName = commentAuthor.username;
  }
  const parentPost = Posts.findOne({_id: comment.postId});
  if (parentPost) {
    algoliaComment.postId = comment.postId;
    algoliaComment.postTitle = parentPost.title;
    algoliaComment.postSlug = parentPost.slug;
  }
  //  Limit comment size to ensure we stay below Algolia search Limit
  // TODO: Actually limit by encoding size as opposed to characters
  if (comment.body) {
    algoliaComment.body = comment.body.slice(0,2000);
  }
  return algoliaComment
}

function userToAlgoliaUser(user) {
  const algoliaUser = {
    objectID: user._id,
    username: user.username,
    displayName: user.displayName,
    createdAt: user.createdAt,
    isAdmin: user.isAdmin,
    bio: user.bio,
    karma: user.karma,
    slug: user.slug,
    website: user.website,
    groups: user.groups,
  }
  return algoliaUser;
}


function postToAlgoliaPost(post) {
  const algoliaMetaInfo = {
    _id: post._id,
    userId: post.userId,
    title: post.title,
    slug: post.slug,
    baseScore: post.baseScore,
    score: post.score,
    status: post.status,
    legacy: post.legacy,
    commentCount: post.commentCount,
    userIP: post.userIP,
    createdAt: post.createdAt,
    postedAt: post.postedAt,
    lastCommentedAt: post.lastCommentedAt,
  };
  const postAuthor = Users.findOne({_id: post.userId});
  if (postAuthor) {
    algoliaMetaInfo.authorDisplayName = postAuthor.displayName;
    algoliaMetaInfo.authorUserName = postAuthor.username;
  }
  const postFeed = RSSFeeds.findOne({_id: post.feedId});
  if (postFeed) {
    algoliaMetaInfo.feedName = postFeed.nickname;
    algoliaMetaInfo.feedLink = post.feedLink;
  }
  let postBatch = [];
  let paragraphCounter =  0;
  let algoliaPost = {};
  if (post.body) {
    post.body.split("\n\n").forEach((paragraph) => {
      algoliaPost = {
        ...algoliaMetaInfo,
        objectID: post._id + "_" + paragraphCounter,
        body: paragraph,
      }
      paragraphCounter++;
      postBatch.push(_.clone(algoliaPost));
    })
  } else {
    postBatch.push(_.clone(algoliaMetaInfo));
  }

  return postBatch;
}

if (runExport){
  const algoliaAppId = getSetting('algoliaAppId');
  const algoliaAdminKey = getSetting('algoliaAdminKey');
  let client = algoliasearch(algoliaAppId, algoliaAdminKey);

  console.log("Starting Export");



  if (runPostExport) {
    console.log("Exporting Posts...")
    let postIndex = client.initIndex('test_posts');

    console.log("Initiated Index connection", postIndex)

    let importPostCount = 0;
    let importBatch = [];
    let postBatch = [];
    let totalErrors = [];
    Posts.find().fetch().forEach((post) => {
      if (post.baseScore > 0) {
        postBatch = postToAlgoliaPost(post);
        importBatch = [...importBatch, ...postBatch];
        importPostCount++;
        if (importPostCount % 100 == 0) {
          console.log("Imported n posts: ",  importPostCount, importBatch.length)
          console.log("Test importBatch", _.map(importBatch, _.clone))
          postIndex.addObjects(_.map(importBatch, _.clone), function gotTaskID(error, content) {
            if(error) {
              console.log("Algolia Error: ", error);
              totalErrors.push(error);
            }
            console.log("write operation received: ", content);
            postIndex.waitTask(content, function contentIndexed() {
              console.log("object " + content + " indexed");
            });
          });
          importBatch = [];
        }
      }
    })
    console.log("Exporting last n posts ", importPostCount);
    postIndex.addObjects(_.map(importBatch, _.clone), function gotTaskID(error, content) {
      if(error) {
        console.log("Algolia Error: ", error)
      }
      console.log("write operation received: " + content);
      postIndex.waitTask(content, function contentIndexed() {
        console.log("object " + content + " indexed");
      });
    });
    console.log("Encountered the following errors: ", totalErrors)
  }



  if (runCommentExport) {
    console.log("Exporting Comments...")
    let commentIndex = client.initIndex('test_comments');

    console.log("Initiated Index connection", commentIndex)
    let exportCommentCount = 0;
    let algoliaComment =  {};
    let exportBatch = [];
    let totalErrors = [];
    Comments.find().fetch().forEach((comment) => {
      if (comment.baseScore > 0) {
        algoliaComment =  commentToAlgoliaComment(comment);
        exportBatch.push(algoliaComment);
        exportCommentCount++;
        if (exportCommentCount % 100 == 0) {
          console.log("Exported n comments: ", exportCommentCount);
          commentIndex.addObjects(_.map(exportBatch, _.clone), function gotTaskID(error, content) {
            if(error) {
              console.log("Algolia Error: ", error);
              totalErrors.push(error);
            }
            console.log("write operation received: ", content);
            commentIndex.waitTask(content, function contentIndexed() {
              console.log("object " + content + " indexed");
            });
          });
          exportBatch = [];
        }
      }
    })
    console.log("Exporting last n posts ", exportCommentCount);
    commentIndex.addObjects(_.map(exportBatch, _.clone), function gotTaskID(error, content) {
      if(error) {
        console.log("Algolia Error: ", error)
      }
      console.log("write operation received: " + content);
      commentIndex.waitTask(content, function contentIndexed() {
        console.log("object " + content + " indexed");
      });
    });
    console.log("Encountered the following errors: ", totalErrors)
  }

  if (runUserExport) {
    console.log("Exporting Users...")
    let userIndex = client.initIndex('test_users');

    console.log("Initiated Index connection", userIndex)
    let exportUserCount = 0;
    let algoliaUser =  {};
    let exportBatch = [];
    let totalErrors = [];
    Users.find().fetch().forEach((user) => {
      algoliaUser =  userToAlgoliaUser(user);
      exportBatch.push(algoliaUser);
      exportUserCount++;
      if (exportUserCount % 100 == 0) {
        console.log("Exported n users: ", exportUserCount);
        userIndex.addObjects(_.map(exportBatch, _.clone), function gotTaskID(error, content) {
          if(error) {
            console.log("Algolia Error: ", error);
            totalErrors.push(error);
          }
          console.log("write operation received: ", content);
          userIndex.waitTask(content, function contentIndexed() {
            console.log("object " + content + " indexed");
          });
        });
        exportBatch = [];
      }
    })
    console.log("Exporting last n users ", exportUserCount);
    userIndex.addObjects(_.map(exportBatch, _.clone), function gotTaskID(error, content) {
      if(error) {
        console.log("Algolia Error: ", error)
      }
      console.log("write operation received: " + content);
      userIndex.waitTask(content, function contentIndexed() {
        console.log("object " + content + " indexed");
      });
    });
    console.log("Encountered the following errors: ", totalErrors)
  }



}
