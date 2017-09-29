import { SyncedCron } from 'meteor/percolatestudio:synced-cron';
// import moment from 'moment';
import { Posts } from '../../modules/posts/index.js';

SyncedCron.options = {
  log: true,
  collectionName: 'cronHistory',
  utc: false,
  collectionTTL: 172800
};


const addJob = function () {
  SyncedCron.add({
    name: 'checkScheduledPosts',
    schedule(parser) {
      return parser.text('every 10 minutes');
    },
    job() {
      // fetch all posts tagged as future
      const scheduledPosts = Posts.find({isFuture: true}, {fields: {_id: 1, status: 1, postedAt: 1, userId: 1, title: 1}}).fetch();

      // filter the scheduled posts to retrieve only the one that should update, considering their schedule
      const postsToUpdate = scheduledPosts.filter(post => post.postedAt <= new Date());

      // update posts found
      if (!_.isEmpty(postsToUpdate)) {
        const postsIds = _.pluck(postsToUpdate, '_id');
        Posts.update({_id: {$in: postsIds}}, {$set: {isFuture: false}}, {multi: true});

        // log the action
        console.log('// Scheduled posts approved:', postsIds); // eslint-disable-line
      }
    }
  });
};

Meteor.startup(function () {
  addJob();
});

