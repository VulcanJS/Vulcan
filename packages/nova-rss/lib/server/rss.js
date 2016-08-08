import Telescope from 'meteor/nova:lib';
import Posts from "meteor/nova:posts";
import Comments from "meteor/nova:comments";

const RSS = Npm.require('rss');

Posts.views.rss = Posts.views.new; // default to "new" view for RSS feed

const getMeta = function (url) {
  var siteUrl = Telescope.settings.get('siteUrl', Meteor.absoluteUrl());
  return {
    title: Telescope.settings.get('title'),
    description: Telescope.settings.get('tagline'),
    feed_url: siteUrl+url,
    site_url: siteUrl,
    image_url: siteUrl+'img/favicon.png'
  };
};

const servePostRSS = function (terms, url) {
  var feed = new RSS(getMeta(url));

  var parameters = Posts.parameters.get(terms);
  delete parameters['options']['sort']['sticky'];

  const postsCursor = Posts.find(parameters.selector, parameters.options);

  postsCursor.forEach(function(post) {

    var description = !!post.body ? post.body+'</br></br>' : '';
    var feedItem = {
      title: post.title,
      description: description + '<a href="' + post.getPageUrl(true) + '">Discuss</a>',
      author: post.author,
      date: post.postedAt,
      guid: post._id,
      url: (Telescope.settings.get("RSSLinksPointTo", "link") === "link") ? Posts.getLink(post) : Posts.getPageUrl(post, true)
    };

    if (post.thumbnailUrl) {
      var url = Telescope.utils.addHttp(post.thumbnailUrl);
      feedItem.custom_elements = [{"imageUrl":url}, {"content": url}];
    }

    feed.item(feedItem);
  });

  return feed.xml();
};

const serveCommentRSS = function (terms, url) {
  var feed = new RSS(getMeta(url));

  Comments.find({isDeleted: {$ne: true}}, {sort: {postedAt: -1}, limit: 20}).forEach(function(comment) {
    post = Posts.findOne(comment.postId);
    feed.item({
     title: 'Comment on '+post.title,
     description: comment.body+'</br></br>'+'<a href="'+Telescope.utils.getPostCommentUrl(post._id, comment._id)+'">Discuss</a>',
     author: comment.author,
     date: comment.postedAt,
     url: comment.getPageUrl(true),
     guid: comment._id
    });
  });

  return feed.xml();
};

export {servePostRSS, serveCommentRSS};
