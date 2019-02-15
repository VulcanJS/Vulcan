import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/vulcan:accounts';
import { getCollection } from 'meteor/vulcan:lib';

Meteor.methods({
  'users.setPassword'({ _id, password }) {
    if (getCollection('Users').isAdmin(Meteor.user())) {
      if (_id && password && password.length) {
        Accounts.setPassword(_id, password);
      }
    }
  },
});
