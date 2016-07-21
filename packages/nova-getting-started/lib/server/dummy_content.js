import moment from 'moment';
import Posts from "meteor/nova:posts";
import Comments from "meteor/nova:comments";
import Users from 'meteor/nova:users';
import Events from "meteor/nova:events";

var toTitleCase = function (str) {
  return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

var createPost = function (slug, postedAt, username, thumbnail) {
  var post = {
    postedAt: postedAt,
    body: Assets.getText("content/" + slug + ".md"),
    title: toTitleCase(slug.replace(/_/g, ' ')),
    dummySlug: slug,
    isDummy: true,
    userId: Meteor.users.findOne({username: username})._id
  };

  if (typeof thumbnail !== "undefined")
    post.thumbnailUrl = "/packages/nova_getting-started/content/images/" + thumbnail;

  Posts.methods.new(post);
};

var createComment = function (slug, username, body, parentBody) {

  var comment = {
    postId: Posts.findOne({dummySlug: slug})._id,
    userId: Meteor.users.findOne({username: username})._id,
    body: body,
    isDummy: true,
    disableNotifications: true
  };
  var parentComment = Comments.findOne({body: parentBody});
  if (parentComment)
    comment.parentCommentId = parentComment._id;

  Comments.methods.new(comment);
};

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
};

var createDummyPosts = function () {

  createPost("read_this_first", moment().toDate(), "Bruce", "telescope.png");

  createPost("deploying", moment().subtract(10, 'minutes').toDate(), "Arnold");

  createPost("customizing", moment().subtract(3, 'hours').toDate(), "Julia");

  createPost("getting_help", moment().subtract(1, 'days').toDate(), "Bruce", "stackoverflow.png");

  createPost("removing_getting_started_posts", moment().subtract(2, 'days').toDate(), "Julia");

};

var createDummyComments = function () {

  createComment("read_this_first", "Bruce", "What an awesome app!");

  createComment("deploying", "Arnold", "Deploy to da choppah!");
  createComment("deploying", "Julia", "Do you really need to say this all the time?", "Deploy to da choppah!");

  createComment("customizing", "Julia", "This is really cool!");

  createComment("removing_getting_started_posts", "Bruce", "Yippee ki-yay!");
  createComment("removing_getting_started_posts", "Arnold", "I'll be back.", "Yippee ki-yay!");

};

deleteDummyContent = function () {
  Meteor.users.remove({'profile.isDummy': true});
  Posts.remove({isDummy: true});
  Comments.remove({isDummy: true});
};

Meteor.methods({
  addGettingStartedContent: function () {
    if (Users.isAdmin(Meteor.user())) {
      createDummyUsers();
      createDummyPosts();
      createDummyComments();
    }
  },
  removeGettingStartedContent: function () {
    if (Users.isAdmin(Meteor.user()))
      deleteDummyContent();
  }
});

Meteor.startup(function () {
  // insert dummy content only if createDummyContent hasn't happened and there aren't any posts in the db
  if (!Users.find().count() && !Events.findOne({name: 'createDummyContent'}) && !Posts.find().count()) {
    createDummyUsers();
    createDummyPosts();
    createDummyComments();
    Events.log({name: 'createDummyContent', unique: true, important: true});
  }
});
