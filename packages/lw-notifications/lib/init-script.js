import Notifications from './collection.js';
import Users from 'meteor/nova:users';
import { newMutation } from 'meteor/nova:core';


const seedData = [
  {
     userId: "TotallyLegitUserID"
  },
  {
     userId: "TotallyLegitUserID2"
  },
  {
     userId: "TotallyLegitUserID3"
  },
  {
     userId: "TotallyLegitUserID4"
  },
  {
     userId: "TotallyLegitUserID5"
  }
];


if (Notifications.find().fetch().length === 0) {
  const currentUser = Users.findOne();
  seedData.forEach(document => {
    newMutation({
      action: 'notifications.new',
      collection: Notifications,
      document: document,
      currentUser: currentUser,
      validate: false
    });
  });
}
