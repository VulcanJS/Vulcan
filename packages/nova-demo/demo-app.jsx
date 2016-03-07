import {mount} from 'react-mounter';

//////////////////////////////////////////////////////
// Collection & Schema                              //
//////////////////////////////////////////////////////

Movies = new Mongo.Collection("movies");

const isLoggedIn = user => !!user;
const isOwner = (user, document) => user._id === document.userId;

const schema = new SimpleSchema({
  name: {
    type: String,
    publish: true,
    control: "text",
    insertableIf: isLoggedIn,
    editableIf: isOwner
  },
  createdAt: {
    type: Date,
    publish: true,
  },
  year: {
    type: String,
    publish: true,
    optional: true,
    control: "text",
    insertableIf: isLoggedIn,
    editableIf: isOwner
  },
  review: {
    type: String,
    publish: true,
    control: "textarea",
    insertableIf: isLoggedIn,
    editableIf: isOwner
  },
  userId: {
    type: String,
    publish: true,
    join: {
      collection: () => Meteor.users,
      joinAs: "user",
      fields: ["_id", "username"]
    }
  }
});

Movies.attachSchema(schema);

//////////////////////////////////////////////////////
// Route                                            //
//////////////////////////////////////////////////////

FlowRouter.route('/demo', {
  name: 'demo',
  action() {    
    mount(MoviesWrapper);
  }
});

//////////////////////////////////////////////////////
// Methods                                          //
//////////////////////////////////////////////////////

Movies.smartMethods({
  createCallback: function (user, document) {
    document = _.extend(document, {
      createdAt: new Date(),
      userId: Meteor.userId()
    });
    return document;
  },
  deleteCallback: isOwner
});

//////////////////////////////////////////////////////
// Publications                                     //
//////////////////////////////////////////////////////

if (Meteor.isServer) {
  Movies.smartPublish("movies.list");
}
