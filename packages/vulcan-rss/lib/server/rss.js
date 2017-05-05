import RSS from 'rss';
import Posts from "meteor/vulcan:posts";
import Comments from "meteor/vulcan:comments";
import { Utils, getSetting } from 'meteor/vulcan:core';

Posts.addView('rss', Posts.views.new); // default to "new" view for RSS feed

const getMeta = (url) => {
  const siteUrl = getSetting('siteUrl', Meteor.absoluteUrl());
  
  return {
    title: getSetting('title'),
    description: getSetting('tagline'),
    feed_url: siteUrl+url,
    site_url: siteUrl,
    image_url: siteUrl+'img/favicon.png'
  };
};

export const servePostRSS = (terms, url) => {
  const feed = new RSS(getMeta(url));

  let parameters = Posts.getParameters(terms);
  delete parameters['options']['sort']['sticky'];

  parameters.options.limit = 50;

  const postsCursor = Posts.find(parameters.selector, parameters.options);

  postsCursor.forEach((post) => {

    const description = !!post.body ? post.body+'</br></br>' : '';
    const feedItem = {
      title: post.title,
      description: description + '<a href="' + Posts.getPageUrl(post, true) + '">Discuss</a>',
      author: post.author,
      date: post.postedAt,
      guid: post._id,
      url: (getSetting("RSSLinksPointTo", "link") === "link") ? Posts.getLink(post) : Posts.getPageUrl(post, true)
    };

    if (post.thumbnailUrl) {
      const url = Utils.addHttp(post.thumbnailUrl);
      feedItem.custom_elements = [{"imageUrl":url}, {"content": url}];
    }

    feed.item(feedItem);
  });

  return feed.xml();
};

export const serveCommentRSS = (terms, url) => {
  const feed = new RSS(getMeta(url));

  const commentsCursor = Comments.find({isDeleted: {$ne: true}}, {sort: {postedAt: -1}, limit: 20});
  
  commentsCursor.forEach(function(comment) {
    const post = Posts.findOne(comment.postId);
    
    feed.item({
     title: 'Comment on ' + post.title,
     description: `${comment.body}</br></br><a href="${Comments.getPageUrl(comment, true)}">Discuss</a>`,
     author: comment.author,
     date: comment.postedAt,
     url: Comments.getPageUrl(comment, true),
     guid: comment._id
    });
  });

  return feed.xml();
};
