/*

Seed the database with some dummy content. 

*/

import moment from 'moment';
import { Promise } from 'meteor/promise';
import Users from 'meteor/vulcan:users';
import { newMutation } from 'meteor/vulcan:core';
import Pics from '../modules/pics/collection.js';
import Comments from '../modules/comments/collection.js';

const dummyFlag = {
  fieldName: 'isDummy',
  fieldSchema: {
    type: Boolean,
    optional: true,
    hidden: true,
  },
};

Users.addField(dummyFlag);
Pics.addField(dummyFlag);
Comments.addField(dummyFlag);

const createPic = async (imageUrl, createdAt, body, username) => {
  const user = await Users.rawCollection().findOne({ username: username });
  const pic = {
    createdAt,
    imageUrl: `http://vulcanjs.org/photos/${imageUrl}`,
    body,
    isDummy: true,
    userId: user._id,
  };
  return newMutation({
    collection: Pics,
    document: pic,
    currentUser: user,
    validate: false,
  });
};

const createComment = async (username, body) => {
  const user = await Users.rawCollection().findOne({ username: username });
  var comment = {
    picId: _.sample(await Pics.rawCollection().find({}).toArray())._id,
    userId: user._id,
    body: body,
    isDummy: true,
  };
  return newMutation({
    collection: Comments,
    document: comment,
    currentUser: user,
    validate: false,
  });
};

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

const createDummyPics = async () => {
  // eslint-disable-next-line no-console
  console.log('// creating dummy pics…');
  return Promise.all([
    createPic('cherry_blossoms.jpg', moment().toDate(), `Kyoto's cherry blossoms`, 'Bruce'),
    createPic('koyo.jpg', moment().subtract(10, 'minutes').toDate(), `Red maple leaves during Fall.`, 'Arnold'),
    createPic('cat.jpg', moment().subtract(3, 'hours').toDate(), `This cat was staring at me for some reason…`, 'Julia'),
    createPic('osaka_tram.jpg', moment().subtract(1, 'days').toDate(), `One of Osaka's remaining tram lines.`, 'Bruce', 'stackoverflow.png'),
    createPic('matsuri.jpg', moment().subtract(2, 'days').toDate(), `A traditional Japanese dance.`, 'Julia'),
    createPic('flowers.jpg', moment().subtract(6, 'days').toDate(), `Beautiful flowers!`, 'Julia'),
    createPic('kyoto-night.jpg', moment().subtract(12, 'days').toDate(), `Kyoto at night`, 'Arnold'),
    createPic('kaisendon.jpg', moment().subtract(20, 'days').toDate(), `This restaurant had the best kaisendon ever`, 'Julia'),
    createPic('forest.jpg', moment().subtract(30, 'days').toDate(), `Such a peaceful place`, 'Bruce'),
  ]);
};

const createDummyComments = async () => {
  // eslint-disable-next-line no-console
  console.log('// creating dummy comments');
  return Promise.all([
    createComment('Bruce', 'Great job.'),
    createComment('Arnold', 'I would love to go there…'),
    createComment('Julia', 'Where did you take this?'),
    createComment('Julia', 'What a cool pic!'),
    createComment('Bruce', 'Nice shot!'),
    createComment('Arnold', `Awesome photo!`),
    createComment('Bruce', 'Great job.'),
    createComment('Arnold', 'I would love to go there…'),
    createComment('Julia', 'Where did you take this?'),
    createComment('Julia', 'What a cool pic!'),
    createComment('Bruce', 'Nice shot!'),
    createComment('Arnold', `Awesome photo!`),
    createComment('Bruce', 'Great job.'),
    createComment('Arnold', 'I would love to go there…'),
    createComment('Julia', 'Where did you take this?'),
    createComment('Julia', 'What a cool pic!'),
    createComment('Bruce', 'Nice shot!'),
    createComment('Arnold', `Awesome photo!`),
  ]);
};

// eslint-disable-next-line no-undef
Vulcan.removeGettingStartedContent = () => {
  Users.remove({ 'profile.isDummy': true });
  Pics.remove({ isDummy: true });
  Comments.remove({ isDummy: true });
  // eslint-disable-next-line no-console
  console.log('// Getting started content removed from seed_posts');
};

Meteor.startup(() => {
  // insert dummy content only if there aren't any users, pics, or comments in the db
  if (!Users.find().count()) {
    Promise.await(createDummyUsers());
  }
  if (!Pics.find().count()) {
    Promise.await(createDummyPics());
  }
  if (!Comments.find().count()) {
    Promise.await(createDummyComments());
  }
});
