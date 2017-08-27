import Posts from 'meteor/vulcan:posts';
import Comments from 'meteor/vulcan:comments';
import Users from 'meteor/vulcan:users';
import RSSFeeds from '../collections/rssfeeds/collection.js';
import Sequences from '../collections/sequences/collection.js';
import algoliasearch from 'algoliasearch';
import { getSetting } from 'meteor/vulcan:core';
import h2p from 'html2plaintext';
import ReactDOMServer from 'react-dom/server';
import { Components } from 'meteor/vulcan:core';
import React from 'react';

const oryToHtml = (content) => {
  if (content) {
    return ReactDOMServer.renderToStaticMarkup(<Components.ContentRenderer state={content} />);
  } else {
    return null;
  }
}

Comments.toAlgolia = (comment) => {
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
  if (comment.content) {
    const html = oryToHtml(comment.content)
    const plaintextBody = h2p(html);
    algoliaComment.body = plaintextBody.slice(0, 2000);
  } else if (comment.body) {
    algoliaComment.body = comment.body.slice(0,2000);
  }
  return [algoliaComment]
}

Sequences.toAlgolia = (sequence) => {
  const algoliaSequence = {
    objectID: sequence._id,
    _id: sequence._id,
    title: sequence.title,
    userId: sequence.userId,
    baseScore: sequence.baseScore,
    score: sequence.score,
    isDeleted: sequence.isDeleted,
    createdAt: sequence.createdAt,
    postedAt: sequence.postedAt,
    algoliaIndexAt: sequence.algoliaIndexAt,
  };
  const sequenceAuthor = Users.findOne({_id: sequence.userId});
  if (sequenceAuthor) {
    algoliaSequence.authorDisplayName = sequenceAuthor.displayName;
    algoliaSequence.authorUserName = sequenceAuthor.username;
    algoliaSequence.authorSlug = sequenceAuthor.slug;
  }
  //  Limit comment size to ensure we stay below Algolia search Limit
  // TODO: Actually limit by encoding size as opposed to characters
  if (sequence.description) {
    const html = oryToHtml(sequence.description);
    const plaintextBody = h2p(html);
    algoliaSequence.plaintextDescription = plaintextBody.slice(0, 2000);
  } else if (sequence.plaintextDescription) {
    algoliaSequence.plaintextDescription = sequence.plaintextDescription.slice(0,2000);
  }
  return [algoliaSequence]
}

Users.toAlgolia = (user) => {
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
  return [algoliaUser];
}


Posts.toAlgolia = (post) => {
  const algoliaMetaInfo = {
    _id: post._id,
    userId: post.userId,
    url: post.url,
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
    isFuture: post.isFuture,
    viewCount: post.viewCount,
    lastCommentedAt: post.lastCommentedAt,
  };
  const postAuthor = Users.findOne({_id: post.userId});
  if (postAuthor) {
    algoliaMetaInfo.authorSlug = postAuthor.slug;
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
  const body = (post.content ? h2p(oryToHtml(post.content)) : (post.htmlBody ? h2p(post.htmlBody) : post.body))
  if (body) {
    body.split("\n\n").forEach((paragraph) => {
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

export function algoliaCollectionExport(Collection, indexName, exportFunction, selector = {}, updateFunction) {
  const algoliaAppId = getSetting('algoliaAppId');
  const algoliaAdminKey = getSetting('algoliaAdminKey');
  let client = algoliasearch(algoliaAppId, algoliaAdminKey);
  console.log(`Exporting ${indexName}...`);
  let algoliaIndex = client.initIndex(indexName);
  console.log("Initiated Index connection", algoliaIndex)

  let importCount = 0;
  let importBatch = [];
  let batchContainer = [];
  let totalErrors = [];
  Collection.find(selector).fetch().forEach((item) => {
    if (updateFunction) updateFunction(item);
    batchContainer = exportFunction(item);
    importBatch = [...importBatch, ...batchContainer];
    importCount++;
    if (importCount % 100 == 0) {
      console.log("Imported n posts: ",  importCount, importBatch.length)
      algoliaIndex.addObjects(_.map(importBatch, _.clone), function gotTaskID(error, content) {
        if(error) {
          console.log("Algolia Error: ", error);
          totalErrors.push(error);
        }
        console.log("write operation received: ", content);
        algoliaIndex.waitTask(content, function contentIndexed() {
          console.log("object " + content + " indexed");
        });
      });
      importBatch = [];
    }
  })
  console.log("Exporting last n documents ", importCount);
  algoliaIndex.addObjects(_.map(importBatch, _.clone), function gotTaskID(error, content) {
    if(error) {
      console.log("Algolia Error: ", error)
    }
    console.log("write operation received: " + content);
    algoliaIndex.waitTask(content, function contentIndexed() {
      console.log("object " + content + " indexed");
    });
  });
  console.log("Encountered the following errors: ", totalErrors)
}

export function algoliaDocumentExport(documents, Collection, indexName, exportFunction, updateFunction) {
  const algoliaAppId = getSetting('algoliaAppId');
  const algoliaAdminKey = getSetting('algoliaAdminKey');
  let client = algoliasearch(algoliaAppId, algoliaAdminKey);
  let algoliaIndex = client.initIndex(indexName);

  let importCount = 0;
  let importBatch = [];
  let batchContainer = [];
  let totalErrors = [];
  documents.forEach((item) => {
    if (updateFunction) updateFunction(item);
    batchContainer = exportFunction(item);
    importBatch = [...importBatch, ...batchContainer];
    importCount++;
    if (importCount % 100 == 0) {
      console.log("Imported n posts: ",  importCount, importBatch.length)
      algoliaIndex.addObjects(_.map(importBatch, _.clone), function gotTaskID(error, content) {
        if(error) {
          console.log("Algolia Error: ", error);
          totalErrors.push(error);
        }
        console.log("write operation received: ", content);
        algoliaIndex.waitTask(content, function contentIndexed() {
          console.log("object " + content + " indexed");
        });
      });
      importBatch = [];
    }
  })
  console.log("Exporting last n documents ", importCount);
  algoliaIndex.addObjects(_.map(importBatch, _.clone), function gotTaskID(error, content) {
    if(error) {
      console.log("Algolia Error: ", error)
    }
    console.log("write operation received: " + content);
    algoliaIndex.waitTask(content, function contentIndexed() {
      console.log("object " + content + " indexed");
    });
  });
  console.log("Encountered the following errors: ", totalErrors)
}
