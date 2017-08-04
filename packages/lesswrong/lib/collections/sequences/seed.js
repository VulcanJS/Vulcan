import Users from 'meteor/vulcan:users'
import Posts from 'meteor/vulcan:posts'
import Chapters from '../chapters/collection.js'
import Sequences from './collection.js'
import { newMutation } from 'meteor/vulcan:core';

Meteor.startup(function () {

  const postsSeedData = [

    {
      title: 'Welcome to LessWrong 2.0',
      categories: null
    },

    {
      title: 'That which is not dead can eternal lie',
      categories: null
    },

    {
      title: 'Epistemic Spot Check',
      categories: null
    },

    {
      title: 'Final',
      categories: null
    },
  ];

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

  let posts = [];

  if (Posts.find({title: 'That which is not dead can eternal lie'}).fetch().length === 0) {
    postsSeedData.forEach(document => {
      posts.push(newMutation({
        action: 'posts.new',
        collection: Posts,
        document: document,
        currentUser: currentUser,
        validate: false
      }));
    });
  } else {
    posts = Posts.find().fetch().slice(0, 5);
  }



  const chaptersSeedData = [

    {
      title: 'null',
      subtitle: 'null',
      description: 'null',
      number: 0,
      postIds: []

    },

    {
      title: 'A Diary of Omega',
      subtitle: 'The Map is Not the Territory',
      description: 'A core idea in decision theory is that of...',
      number: 1,
      postIds: [posts[0]._id, posts[1]._id]

    },

    {
      title: 'Omega is coming home',
      subtitle: 'Omega is here to do two things...',
      description: 'An ombusdman, ombuds or public advocate is an official...',
      number: 2,
      postIds: [posts[2]._id, posts[3]._id]

    },

    {
      title: 'null',
      subtitle: 'null',
      description: 'null',
      number: 0,
      postIds: []

    },

    {
      title: 'A Diary of Omega',
      subtitle: 'The Map is Not the Territory',
      description: 'A core idea in decision theory is that of...',
      number: 1,
      postIds: [posts[0]._id, posts[2]._id]

    },

    {
      title: 'Omega is coming home',
      subtitle: 'Omega is here to do two things...',
      description: 'An ombusdman, ombuds or public advocate is an official...',
      number: 2,
      postIds: [posts[1]._id, posts[3]._id]

    }

  ]

  let chapters = [];

  if (Chapters.find().fetch().length === 0) {
    chaptersSeedData.forEach(document => {
      chapters.push(newMutation({
        action: 'chapters.new',
        collection: Chapters,
        document: document,
        currentUser: currentUser,
        validate: false
      }));
    });
  } else {
    chapters = Chapters.find().fetch().slice(0, 7);
  }

  const sequencesSeedData = [

    {
      title: 'Highly Advanced Epistemology 101 for Beginners',
      description: 'The original sequences were a series of essays...',
      chapterIds: [chapters[0]._id, chapters[1]._id, chapters[2]._id]
    },

    {
      title: 'How to make rationalist pie',
      description: 'Actually you should think about tau...',
      chapterIds: [chapters[3]._id, chapters[4]._id, chapters[5]._id]
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
})
