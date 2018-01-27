/*

Newsletter setup

*/

import VulcanEmail from 'meteor/vulcan:email';
import { addCallback } from 'meteor/vulcan:core';
// email test routes (make available to client & server)
import Newsletters from 'meteor/vulcan:newsletter';
import { Posts } from './collection.js';
import moment from 'moment';

VulcanEmail.addEmails({

  newsletter: {
    template: 'newsletter',
    path: '/email/newsletter',
    subject(data) {
      return _.isEmpty(data) ? '[Generated on server]' : Newsletters.getSubject(data.PostsList);
    },
    data() {
      return {
        date: moment().format('MMMM D YYYY')
      }
    },
    query: `
      query NewsletterQuery($terms: JSON){
        SiteData{
          title
        }
        PostsList(terms: $terms){

          _id
          title
          url
          pageUrl
          linkUrl
          domain
          htmlBody
          thumbnailUrl
          commentsCount
          postedAtFormatted

          user{
            pageUrl
            displayName
          }

          comments(limit: 3){
            user{
              displayName
              avatarUrl
              pageUrl
            }
            htmlBody
            postedAt
          }
          
        }
      }
    `,
    isValid(data) {
      return data.PostsList && data.PostsList.length;
    },
    testVariables() {
      return {
        terms : {
          view: 'newsletter'
        }
      }
    }
  },

  newsletterConfirmation: {
    template: 'newsletterConfirmation',
    path: '/email/newsletter-confirmation',
    subject() {
      return 'Newsletter confirmation';
    }
  }

});

function MarkPostsAsScheduled (email) {
  const postsIds = _.pluck(email.data.PostsList, '_id');
  // eslint-disable-next-line no-console
  console.log(postsIds)
  const updated = Posts.update({_id: {$in: postsIds}}, {$set: {scheduledAt: new Date()}}, {multi: true}) // eslint-disable-line
  // eslint-disable-next-line no-console
  console.log(`updated ${updated} posts`)
}
addCallback('newsletter.send.async', MarkPostsAsScheduled);
