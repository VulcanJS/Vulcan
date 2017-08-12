import Users from 'meteor/vulcan:users';
import Posts from 'meteor/vulcan:posts';
import Chapters from '../chapters/collection.js';
import Sequences from './collection.js';
import Collections from '../collections/collection.js';
import { newMutation } from 'meteor/vulcan:core';
import moment from 'moment';
import Comments from "meteor/vulcan:comments";
import Events from "meteor/vulcan:events";

const dummyFlag = {
  fieldName: 'isDummy',
  fieldSchema: {
    type: Boolean,
    optional: true,
    hidden: true
  }
}
Users.addField(dummyFlag);
Posts.addField(dummyFlag);
Comments.addField(dummyFlag);

Posts.addField({
  fieldName: 'dummySlug',
  fieldSchema: {
    type: String,
    optional: true,
    hidden: true // never show this
  }
});

var toTitleCase = function (str) {
  return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

const createPost = function (slug, postedAt, username, thumbnail) {

  const user = Users.findOne({username: username});

  var post = {
    postedAt: postedAt,
    body: Assets.getText("content/" + slug + ".md"),
    title: toTitleCase(slug.replace(/_/g, ' ')),
    dummySlug: slug,
    isDummy: true,
    userId: user._id
  };

  if (typeof thumbnail !== "undefined")
    post.thumbnailUrl = "/packages/vulcan_getting-started/content/images/" + thumbnail;

  newMutation({
    collection: Posts,
    document: post,
    currentUser: user,
    validate: false
  });

};

const createComment = function (slug, username, body, parentBody) {

  const user = Users.findOne({username: username});

  var comment = {
    postId: Posts.findOne({dummySlug: slug})._id,
    userId: user._id,
    body: body,
    isDummy: true,
    disableNotifications: true
  };
  var parentComment = Comments.findOne({body: parentBody});
  if (parentComment)
    comment.parentCommentId = parentComment._id;

  newMutation({
    collection: Comments,
    document: comment,
    currentUser: user,
    validate: false
  });
};


const createUser = function (username, email, password = null) {
  options = {
    username,
    email,
    password
  };
  console.log("Creating user: <", options, ">");
  Accounts.createUser(options);
};


const createCollection = function () {

  const user = Users.findOne();

  var collection = {

  };

  newMutation({
    collection: Collections,
    document: collection,
    currentUser: user,
    validate: false
  });
};

var createDummyUsers = function () {
  console.log('// inserting dummy users!!!!');
  createUser('admin', 'admin@admin.com', 'password');
  createUser('Harm', 'dummyuser1@telescopeapp.org');
  createUser('Ben', 'dummyuser2@telescopeapp.org');
  createUser('Oliver', 'dummyuser3@telescopeapp.org');
};

var createDummyPosts = function () {
  console.log('// inserting dummy posts');

  createPost("read_this_first", moment().toDate(), "Harm", "telescope.png");

  createPost("deploying", moment().subtract(10, 'minutes').toDate(), "Ben");

  createPost("customizing", moment().subtract(3, 'hours').toDate(), "Oliver");

  createPost("getting_help", moment().subtract(1, 'days').toDate(), "Harm", "stackoverflow.png");

  createPost("removing_getting_started_posts", moment().subtract(2, 'days').toDate(), "Oliver");

};

var createDummyComments = function () {
  console.log('// inserting dummy comments…');

  createComment("read_this_first", "Harm", "What an awesome app!");

  createComment("deploying", "Ben", "Deploy to da choppah!");
  createComment("deploying", "Oliver", "Do you really need to say this all the time?", "Deploy to da choppah!");

  createComment("customizing", "Oliver", "This is really cool!");

  createComment("removing_getting_started_posts", "Harm", "Yippee ki-yay!");
  createComment("removing_getting_started_posts", "Ben", "I'll be back.", "Yippee ki-yay!");

};

Vulcan.removeGettingStartedContent = () => {
  Users.remove({'profile.isDummy': true});
  Posts.remove({isDummy: true});
  Comments.remove({isDummy: true});
  console.log('// Getting started content removed');
};

Meteor.startup(function () {
  // insert dummy content only if createDummyContent hasn't happened and there aren't any posts or users in the db
  if (!Users.find().count()) {
    createDummyUsers();
  }
  if (!Posts.find().count()) {
    createDummyPosts();
  }
  if (!Comments.find().count()) {
    createDummyComments();
  }
  if (!Collections.find().count()) {
    createCollection();
  }

  if (Users.find().fetch().length === 0) {
    Accounts.createUser({
      username: 'DemoUser',
      email: 'dummyuser@telescopeapp.org',
      profile: {
        isDummy: true
      }
    });
  }

  const currentUser = Users.findOne();

  const chaptersSeedData = [

    {
      title: 'null',
      subtitle: 'null',
      description: 'null',
      number: 0,
      postIds: []

    },

    {
      title: 'Made Up',
      subtitle: 'This is where things are',
      description: 'Captain Underpants',
      number: 1,
      postIds: [Posts.findOne({dummySlug: "read_this_first"})._id, Posts.findOne({dummySlug: "deploying"})._id]

    },

    {
      title: 'Even More Made Up',
      subtitle: 'More Things Are Here',
      description: 'Blah Blah Blah',
      number: 2,
      postIds: [Posts.findOne({dummySlug: "customizing"})._id, Posts.findOne({dummySlug: "removing_getting_started_posts"})._id]

    },

    {
      title: 'A Diary of Omega',
      subtitle: 'The Map is Not the Territory',
      description: 'A core idea in decision theory is that of...',
      number: 1,
      postIds: [Posts.findOne({dummySlug: "getting_help"})._id, Posts.findOne({dummySlug: "customizing"})._id]

    },

    {
      title: 'Omega is coming home',
      subtitle: 'Omega is here to do two things...',
      description: 'An ombusdman, ombuds or public advocate is an official...',
      number: 2,
      postIds: [Posts.findOne({dummySlug: "removing_getting_started_posts"})._id, Posts.findOne({dummySlug: "deploying"})._id]

    }

  ]

  if (Chapters.find().fetch().length === 0) {
    chaptersSeedData.forEach(document => {
      newMutation({
        action: 'chapters.new',
        collection: Chapters,
        document: document,
        currentUser: currentUser,
        validate: false
      });
    });
  }

  const sequencesSeedData = [

    {
      title: 'Highly Advanced Epistemology 101 for Beginners',
      description: 'The original sequences were a series of essays...',
      chapterIds: [Chapters.findOne()._id, Chapters.findOne({title: 'Made Up'})._id, Chapters.findOne({title: 'Even More Made Up'})._id]
    },
    {
      title: 'How to make rationalist pie',
      description: 'Actually you should think about tau...',
      chapterIds: [Chapters.findOne()._id, Chapters.findOne({title: 'A Diary of Omega'})._id, Chapters.findOne({title: 'Omega is coming home'})._id]
    }

  ]

  if (Sequences.find().fetch().length === 0) {
    sequencesSeedData.forEach(document => {
      newMutation({
        action: 'sequences.new',
        collection: Sequences,
        document: document,
        currentUser: currentUser,
        validate: false
      });
    });
  }
});
