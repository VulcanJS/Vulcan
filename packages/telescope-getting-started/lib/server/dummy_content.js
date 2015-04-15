var toTitleCase = function (str) {
  return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

var createPost = function (slug, postedAt, username, thumbnail, category, u) {
  var post = {
    postedAt: postedAt,
    title: toTitleCase(slug.replace(/_/g, ' ')),
    dummySlug: slug,
    isDummy: true,
    thumbnailUrl:thumbnail,
    url: u,
    userId: Meteor.users.findOne({username: username})._id
  }
  console.log(post);
  if (category !== "undefined") {
    post.category = category;
  }

  submitPost(post);
}

var createComment = function (slug, username, body, parentBody) {

  var comment = {
    postId: Posts.findOne({dummySlug: slug})._id,
    userId: Meteor.users.findOne({username: username})._id,
    body: body,
    isDummy: true,
    disableNotifications: true
  }
  if (parentComment = Comments.findOne({body: parentBody}))
    comment.parentCommentId = parentComment._id;

  submitComment(comment);
}

var createDummyUsers = function () {
  Accounts.createUser({
    username: 'Bruce',
    email: 'dummyuser1@telescopeapp.org',
    profile: {
      isDummy: true
    }
  });
  Accounts.createUser({
    username: 'Arnold',
    email: 'dummyuser2@telescopeapp.org',
    profile: {
      isDummy: true
    }
  });
  Accounts.createUser({
    username: 'Julia',
    email: 'dummyuser3@telescopeapp.org',
    profile: {
      isDummy: true
    }
  });
  Accounts.createUser({
    username: 'Ishika',
    email: 'ish3@telescopeapp.org',
    profile: {
      isDummy: true
    }
  })
}

var createDummyPosts = function () {
  createPost("Batman vs. Robin Movie - Watch Batman vs. Robin Movie online in high quality",
             moment().subtract(2, 'days').toDate(),
             "Ishika", "20150331/199924e8c78a91370e4299e67c299723",
             "beauty_&_fitness",
             "http://kisscartoon.me/cartoon/batman-vs-robin/movie?id=47669");

}

var createDummyComments = function () {

  /*createComment("read_this_first", "Bruce", "What an awesome app!");

  createComment("deploying_telescope", "Arnold", "Deploy to da choppah!");
  createComment("deploying_telescope", "Julia", "Do you really need to say this all the time?", "Deploy to the choppah!");

  createComment("customizing_telescope", "Julia", "I can't wait to make my app pretty. Get it? *Pretty*?");

  createComment("removing_getting_started_posts", "Bruce", "Yippee ki-yay, motherfucker!");
  createComment("removing_getting_started_posts", "Arnold", "I don't think you're supposed to swear in here…", "Yippee ki-yay, motherfucker!");
  */
}

deleteDummyContent = function () {
  Meteor.users.remove({'profile.isDummy': true});
  Posts.remove({isDummy: true});
  Comments.remove({isDummy: true});
}

Meteor.methods({
  addGettingStartedContent: function () {
    if (isAdmin(Meteor.user())) {
      createDummyUsers();
      createDummyPosts();
      createDummyComments();
    }
  },
  removeGettingStartedContent: function () {
    if (isAdmin(Meteor.user()))
      deleteDummyContent();
  }
})

Meteor.startup(function () {
  // insert dummy content only if createDummyContent hasn't happened and there aren't any posts in the db
  deleteDummyContent();
  if (!Posts.find().count()) {
    createDummyUsers(); 
    createDummyPosts();
    createDummyComments();
    logEvent({name: 'createDummyContent', unique: true, important: true});
  }
});