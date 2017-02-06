import { Meteor } from 'meteor/meteor';

Meteor.subscribe = () => ({
  stop() {},
  ready() { return true },
})
