import Campaign from 'meteor/nova:newsletter';

const emailRoutes = [
  {
    name: "New Post",
    path: "/email/new-post/:_id?",
    action: (params, req, res, next) => {
      var html;
      var post = typeof params.id === "undefined" ? Posts.findOne() : Posts.findOne(params.id);
      if (!!post) {
        html = Telescope.email.getTemplate('newPost')(Posts.getNotificationProperties(post));
      } else {
        html = "<h3>No post found.</h3>"
      }
      res.end(Telescope.email.buildTemplate(html));
    }
  },
  {
    name: "Post Approved",
    path: "/email/post-approved/:_id?",
    action: (params, req, res, next) => {
      var html;
      var post = typeof params.id === "undefined" ? Posts.findOne() : Posts.findOne(params.id);
      if (!!post) {
        html = Telescope.email.getTemplate('postApproved')(Posts.getNotificationProperties(post));
      } else {
        html = "<h3>No post found.</h3>"
      }
      res.end(Telescope.email.buildTemplate(html));
    }
  },
  {
    name: "New Comment",
    path: "/email/new-comment/:_id?",
    action: (params, req, res, next) => {
      var html;
      var comment = typeof params.id === "undefined" ? Comments.findOne() : Comments.findOne(params.id);
      var post = Posts.findOne(comment.postId);
      if (!!comment) {
        html = Telescope.email.getTemplate('newComment')(Comments.getNotificationProperties(comment, post));
      } else {
        html = "<h3>No post found.</h3>"
      }
      res.end(Telescope.email.buildTemplate(html));
    }
  },
  {
    name: "New Reply",
    path: "/email/new-reply/:_id?",
    action: (params, req, res, next) => {
      var html;
      var comment = typeof params.id === "undefined" ? Comments.findOne() : Comments.findOne(params.id);
      var post = Posts.findOne(comment.postId);
      if (!!comment) {
        html = Telescope.email.getTemplate('newReply')(Comments.getNotificationProperties(comment, post));
      } else {
        html = "<h3>No post found.</h3>"
      }
      res.end(Telescope.email.buildTemplate(html));
    }
  },
  {
    name: "New User",
    path: "/email/new-user/:_id?",
    action: (params, req, res, next) => {
      var html;
      var user = typeof params.id === "undefined" ? Meteor.users.findOne() : Meteor.users.findOne(params.id);
      var emailProperties = {
        profileUrl: Users.getProfileUrl(user),
        username: Users.getUserName(user)
      };
      html = Telescope.email.getTemplate('newUser')(emailProperties);
      res.end(Telescope.email.buildTemplate(html));
    }
  },
  {
    name: "Account Approved",
    path: "/email/account-approved/:_id?",
    action: (params, req, res, next) => {
      var user = typeof params.id === "undefined" ? Meteor.users.findOne() : Meteor.users.findOne(params.id);
      var emailProperties = {
        profileUrl: Users.getProfileUrl(user),
        username: Users.getUserName(user),
        siteTitle: Telescope.settings.get('title'),
        siteUrl: Telescope.utils.getSiteUrl()
      };
      var html = Telescope.email.getTemplate('accountApproved')(emailProperties);
      res.end(Telescope.email.buildTemplate(html));
    }
  },
  {
    name: "Newsletter",
    path: "/email/newsletter",
    action: (params, req, res, next) => {
      var campaign = Campaign.build(Campaign.getPosts(Telescope.settings.get('postsPerNewsletter', 5)));
      var newsletterEnabled = '<div class="newsletter-enabled"><strong>Newsletter Enabled:</strong> '+Telescope.settings.get('enableNewsletter', true)+'</div>';
      var mailChimpAPIKey = '<div class="mailChimpAPIKey"><strong>mailChimpAPIKey:</strong> '+(typeof Telescope.settings.get('mailChimpAPIKey') !== "undefined")+'</div>';
      var mailChimpListId = '<div class="mailChimpListId"><strong>mailChimpListId:</strong> '+(typeof Telescope.settings.get('mailChimpListId') !== "undefined")+'</div>';
      var campaignSubject = '<div class="campaign-subject"><strong>Subject:</strong> '+campaign.subject+' (note: contents might change)</div>';
      var campaignSchedule = '<div class="campaign-schedule"><strong>Scheduled for:</strong> '+ Meteor.call('getNextJob') +'</div>';
      res.end(newsletterEnabled+mailChimpAPIKey+mailChimpListId+campaignSubject+campaignSchedule+campaign.html);
    }
  },
  {
    name: "Newsletter Confirmation",
    path: "/email/newsletter-confirmation",
    action: (params, req, res, next) => {
      var confirmationHtml = Telescope.email.getTemplate('newsletterConfirmation')({
        time: 'January 1st, 1901',
        newsletterLink: 'http://example.com',
        subject: 'Lorem ipsum dolor sit amet'
      });
      res.end(Telescope.email.buildTemplate(confirmationHtml));
    }
  }
];

emailRoutes.forEach(route => Picker.route(route.path, route.action));

export default emailRoutes;