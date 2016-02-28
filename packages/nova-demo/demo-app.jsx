import {mount} from 'react-mounter';

//////////////////////////////////////////////////////
// Route                                            //
//////////////////////////////////////////////////////

FlowRouter.route('/demo', {
  name: 'demo',
  action(params, queryParams) {    
    mount(MoviesWrapper);
  }
});

//////////////////////////////////////////////////////
// Collection & Schema                              //
//////////////////////////////////////////////////////

Movies = new Mongo.Collection("movies");

const isLoggedIn = user => !!user;
const isOwner = (user, document) => {user._id === document.userId};

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
    publish: user => Users.is.admin(user),
    join: {
      collection: () => Meteor.users,
      joinAs: "user",
      fields: ["_id", "username"]
    }
  }
});

Movies.attachSchema(schema);

//////////////////////////////////////////////////////
// Methods                                          //
//////////////////////////////////////////////////////

Movies.smartMethods({
  createCallback: function (document) {
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
