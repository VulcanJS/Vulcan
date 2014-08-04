defaultFrequency = 7;
defaultPosts = 5;

getCampaignPosts = function (postsCount) {
  var newsletterFrequency = getSetting('newsletterFrequency', defaultFrequency);
  var xDaysAgo = moment().subtract('days', newsletterFrequency).toDate();
  var params = getParameters({
    view: 'campaign',
    limit: postsCount,
    after: xDaysAgo
  });
  return Posts.find(params.find, params.options).fetch();
}

buildCampaign = function (postsArray) {
  var postsHTML = '', subject = '';

  // 1. Iterate through posts and pass each of them through a handlebars template
  postsArray.forEach(function (post, index) {
    if(index > 0)
      subject += ', ';

    subject += post.title;

    var postUser = Meteor.users.findOne(post.userId);

    // the naked post object as stored in the database is missing a few properties, so let's add them
    var properties = _.extend(post, {
      authorName: getAuthorName(post),
      postLink: getPostLink(post),
      profileUrl: getProfileUrl(postUser),
      postPageLink: getPostPageUrl(post),
      date: moment(post.postedAt).format("MMMM D YYYY")
    });

    if (post.body)
      properties.body = marked(trimWords(post.body, 20)).replace('<p>', '').replace('</p>', ''); // remove p tags
    
    if(post.url)
      properties.domain = getDomain(post.url)

    postsHTML += Handlebars.templates[getTemplate('emailPostItem')](properties);
  });

  // 2. Wrap posts HTML in digest template
  var digestHTML = Handlebars.templates[getTemplate('emailDigest')]({
    siteName: getSetting('title'),
    date: moment().format("dddd, MMMM Do YYYY"),
    content: postsHTML
  });

  // 3. wrap digest HTML in email wrapper tempalte
  var emailHTML = buildEmailTemplate(digestHTML);

  return {
    postIds: _.pluck(postsArray, '_id'),
    subject: trimWords(subject, 15),
    html: emailHTML
  }
}

scheduleCampaign = function (campaign) {
  MailChimpOptions.apiKey = getSetting('mailChimpAPIKey');
  MailChimpOptions.listId = getSetting('mailChimpListId');

  var htmlToText = Meteor.require('html-to-text');
  var text = htmlToText.fromString(campaign.html, {
      wordwrap: 130
  });
  var defaultEmail = getSetting('defaultEmail');

  if(!!MailChimpOptions.apiKey && !!MailChimpOptions.listId){

    console.log( 'Creating campaign…');

    try {
        var api = new MailChimp();
    } catch ( error ) {
        console.log( error.message );
    }

    api.call( 'campaigns', 'create', {
      type: 'regular',
      options: {
        list_id: MailChimpOptions.listId,
        subject: campaign.subject,
        from_email: getSetting('defaultEmail'),
        from_name: getSetting('title')+ ' Top Posts',
      },
      content: {
        html: campaign.html,
        text: text
      }
    }, Meteor.bindEnvironment(function ( error, result ) {
      if ( error ) {
        console.log( error.message );
      } else {
        console.log( 'Campaign created');
        // console.log( JSON.stringify( result ) );

        var cid = result.id;
        var archive_url = result.archive_url;
        var scheduledTime = moment().zone(0).add('hours', 1).format("YYYY-MM-DD HH:mm:ss");

        api.call('campaigns', 'schedule', {
          cid: cid,
          schedule_time: scheduledTime
        }, Meteor.bindEnvironment(function ( error, result) {
          if (error) {
            console.log( error.message );
          }else{
            console.log('Campaign scheduled for '+scheduledTime);
            console.log(campaign.subject)
            // console.log( JSON.stringify( result ) );

            // mark posts as sent
            Posts.update({_id: {$in: campaign.postIds}}, {$set: {scheduledAt: new Date()}}, {multi: true})

            // send confirmation email
            var confirmationHtml = Handlebars.templates[getTemplate('emailDigestConfirmation')]({
              time: scheduledTime,
              newsletterLink: archive_url,
              subject: campaign.subject
            });
            sendEmail(defaultEmail, 'Newsletter scheduled', buildEmailTemplate(confirmationHtml));
          }
        }));
      }
    }));
  }
}

scheduleNextCampaign = function () {
  var posts = getCampaignPosts(getSetting('postsPerNewsletter', defaultPosts));
  if(!!posts.length){
    scheduleCampaign(buildCampaign(posts))
  }else{
    console.log('No posts to schedule today…')
  }
}

Meteor.methods({
  testCampaign: function (postsCount) {
    scheduleNextCampaign(postsCount);
  }
});

SyncedCron.add({
  name: 'Schedule digest newsletter.',
  schedule: function(parser) {
    // parser is a later.parse object
    var frequency = getSetting('newsletterFrequency', defaultFrequency);
    var interval = 'days';
    return parser.text('every '+frequency+' '+interval);
  }, 
  job: function() {
    scheduleNextCampaign();
  }
});

Meteor.startup(function() {
  if(getSetting('newsletterFrequency') != 0) {
    SyncedCron.start();
  };
});