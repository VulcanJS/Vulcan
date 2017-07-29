/*

Seed the database with some dummy content. 

*/

import Categories from '../modules/categories/collection.js';
import Users from 'meteor/vulcan:users';
import { newMutation } from 'meteor/vulcan:core';

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
  },{
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

const createUser = function (username, email) {
  const user = {
    username,
    email,
    isDummy: true
  };
  newMutation({
    collection: Users, 
    document: user,
    validate: false
  });
}

var createDummyUsers = function () {
  console.log('// inserting dummy users…');
  createUser('Bruce', 'dummyuser1@telescopeapp.org');
  createUser('Arnold', 'dummyuser2@telescopeapp.org');
  createUser('Julia', 'dummyuser3@telescopeapp.org');
};

Meteor.startup(function () {
  if (Users.find().fetch().length === 0) {
    createDummyUsers();
  }
  const currentUser = Users.findOne(); // just get the first user available
  if (Categories.find().fetch().length === 0) {
    console.log('// creating dummy categories');
    seedData.forEach(document => {
      newMutation({
        action: 'categories.new',
        collection: Categories,
        document: document, 
        currentUser: currentUser,
        validate: false
      });
    });
  }
});