Posts = new Meteor.Collection('posts');
Meteor.subscribe('posts');

Comments = new Meteor.Collection('comments');
Meteor.subscribe('comments');

MyVotes = new Meteor.Collection('myvotes');
Meteor.subscribe('myvotes');

Session.set('state', 'list');
