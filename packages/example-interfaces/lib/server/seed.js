/*

Seed the database with some dummy content. 

*/

import { Promise } from 'meteor/promise';
import Users from 'meteor/vulcan:users';
import { newMutation } from 'meteor/vulcan:core';
import Categories from '../modules/categories/collection.js';

const seedData = [
  {
    _id: '56yknRE2hKQughQRc',
    name: 'Music',
  }, {
    _id: 'aJSgH5o6yGPWZxdeN',
    name: 'Pop',
    parentId: '56yknRE2hKQughQRc',
  },
  {
    _id: 'JXWnLuW8BTsk5MQnp',
    name: 'Rock',
    parentId: '56yknRE2hKQughQRc',
  }, {
    _id: 'rJiv7dPoXncqus6tM',
    name: 'Movies',
  }, {
    _id: 'MTw4maNZo2efd5hzv',
    name: 'Action',
    parentId: 'rJiv7dPoXncqus6tM',
  }, {
    _id: 'jp3zyDPvcjNQvJGWL',
    name: 'Comedy',
    parentId: 'rJiv7dPoXncqus6tM',
  }, {
    _id: 'J9qgemFRrDFYCxbBz',
    name: 'Romantic comedy',
    parentId: 'jp3zyDPvcjNQvJGWL',
  }, {
    _id: '3yFHQML4D6hKSx4fb',
    name: 'Dry humor',
    parentId: 'jp3zyDPvcjNQvJGWL',
  }, {
    _id: 'E2H9cTEBQt6rkg8uw',
    name: 'Sports',
  }, {
    _id: 'd8S86bFm4gqHsC6Q2',
    name: 'Football',
    parentId: 'E2H9cTEBQt6rkg8uw',
  }, {
    _id: 'wA2cRz2vYi2Ls6zzh',
    name: 'Rugby',
    parentId: 'E2H9cTEBQt6rkg8uw',
  }, {
    _id: 'dg7yh5GANnT2QJo8a',
    name: 'Tennis',
    parentId: 'E2H9cTEBQt6rkg8uw',
  },
];

const createUser = async (username, email) => {
  const user = {
    username,
    email,
    isDummy: true,
  };
  return newMutation({
    collection: Users,
    document: user,
    validate: false,
  });
};

const createDummyUsers = async () => {
  // eslint-disable-next-line no-console
  console.log('// inserting dummy users…');
  return Promise.all([
    createUser('Bruce', 'dummyuser1@telescopeapp.org'),
    createUser('Arnold', 'dummyuser2@telescopeapp.org'),
    createUser('Julia', 'dummyuser3@telescopeapp.org'),
  ]);
};

// eslint-disable-next-line no-undef
Vulcan.removeGettingStartedContent = () => {
  Users.remove({ 'profile.isDummy': true });
  // eslint-disable-next-line no-console
  console.log('// Getting started content removed');
};

Meteor.startup(() => {
  if (Users.find().fetch().length === 0) {
    Promise.await(createDummyUsers());
  }
  const currentUser = Users.findOne(); // just get the first user available
  if (Categories.find().fetch().length === 0) {
    // eslint-disable-next-line no-console
    console.log('// creating dummy categories');
    Promise.awaitAll(seedData.map(document => newMutation({
      action: 'categories.new',
      collection: Categories,
      document,
      currentUser,
      validate: false,
    })));
  }
});
