import Notifications from './collection.js';
import Users from 'meteor/vulcan:users';
import { newMutation } from 'meteor/vulcan:core';


const seedData = [
  {
     userId: "3WavsEhbS76e7opxK",
     notificationMessage: "This is the first notification",
     viewed: false,
     type: "comment",
     documentId: "zzyJ8xDZjcYZYR4oJ",
  },
  {
    userId: "3WavsEhbS76e7opxK",
    notificationMessage: "This is the second notification",
    viewed: true,
    type: "comment",
  },
  {
    userId: "3WavsEhbS76e7opxK",
    notificationMessage: "This is the third notification",
    viewed: false,
    type: "post",
    documentId: "tgPcjkMApBA4MsQ7a",
  },
  {
    userId: "3WavsEhbS76e7opxK",
    notificationMessage: "This is the fourth notification",
    viewed: true,
    type: "post",
    documentId: "tgPcjkMApBA4MsQ7a",
  },
  {
    userId: "3WavsEhbS76e7opxK",
    notificationMessage: "This is the fifth notification",
  },
  {
    userId: "3WavsEhbS76e7opxK",
    notificationMessage: "This is the sixth notification",
    viewed: false,
    type: "user",
    documentId: "3WavsEhbS76e7opxK",
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
