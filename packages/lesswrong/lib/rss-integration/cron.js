import { SyncedCron } from 'meteor/percolatestudio:synced-cron';
// import moment from 'moment';
import RSSFeeds from '../collections/rssfeeds/collection.js';
import { newMutation, editMutation } from 'meteor/vulcan:core';
import Posts from 'meteor/vulcan:posts';
import Users from 'meteor/vulcan:users';

SyncedCron.options = {
  log: true,
  collectionName: 'cronHistory',
  utc: false,
  collectionTTL: 172800
};


const addJob = function () {
  SyncedCron.add({
    name: 'addNewRSSPosts',
    schedule(parser) {
      return parser.text('every 10 minutes');
    },
    job() {
      const feedparser = require('feedparser-promised');

      RSSFeeds.find().forEach(feed => {
        // create array of all posts in current rawFeed object
        let previousPosts = feed.rawFeed || [];

        // check the feed for new posts
        const url = feed.url;
        feedparser.parse(url).then( currentPosts => {
          let newPosts = currentPosts.filter(function (post) {
              return !previousPosts.some(prevPost => {
                return post.link === prevPost.link
              } )
          })

          // update feed object with new feed data (mutation)
          var set = {};
          set.rawFeed = currentPosts;

          editMutation({
            collection: RSSFeeds,
            documentId: feed._id,
            set: set,
            validate: false,
          })

          newPosts.forEach(function (newPost) {
            var body;

            if (newPost['content:encoded'] && newPost.displayFullContent) {
              body = newPost['content:encoded'];
            } else if (newPost.description) {
              body = newPost.description;
            } else if (newPost.summary) {
              body = newPost.summary;
            } else {
              body = "";
            }

            var post = {
              title: newPost.title,
              userId: feed.userId,
              htmlBody: body,
              feedId: feed._id,
              feedLink: newPost.link
            };

            let lwUser = Users.findOne({_id: feed.userId});

            newMutation({
              collection: Posts,
              document: post,
              currentUser: lwUser,
              validate: false,
            })
          })

        }).catch( (error) => {
          // console.log(feed);
          console.log('error: ', error);
        });
     })
    }
  });
};


Meteor.startup(addJob);
