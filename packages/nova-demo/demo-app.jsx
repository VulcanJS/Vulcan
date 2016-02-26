import {mount} from 'react-mounter';

//////////////////////////////////////////////////////
// Route                                            //
//////////////////////////////////////////////////////

FlowRouter.route('/demo', {
  name: 'posts.single',
  action(params, queryParams) {    
    mount(MoviesWrapper);
  }
});

//////////////////////////////////////////////////////
// Collection & Schema                              //
//////////////////////////////////////////////////////

Movies = new Mongo.Collection("movies");

const hasUserId = userId => !!userId;
const isOwner = (userId, document) => userId === document.userId;

const schema = new SimpleSchema({
  name: {
    type: String,
    publish: true,
    control: "text",
    createIf: hasUserId,
    editIf: isOwner,
    editableBy: ["member", "admin"]
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
    createIf: hasUserId,
    editIf: isOwner,
    editableBy: ["member", "admin"]
  },
  review: {
    type: String,
    publish: true,
    control: "textarea",
    createIf: hasUserId,
    editIf: isOwner,
    editableBy: ["member", "admin"]
  },
  userId: {
    type: String,
    publish: true,
    join: {
      collection: () => Meteor.users,
      joinAs: "user"
    }
  }
});

Movies.attachSchema(schema);

//////////////////////////////////////////////////////
// Methods                                          //
//////////////////////////////////////////////////////

Movies.initMethods({
  deleteIf: isOwner,
  createCallback: function (document) {
    document = _.extend(document, {
      createdAt: new Date(),
      userId: Meteor.userId()
    });
    return document;
  }
});

//////////////////////////////////////////////////////
// Publications                                     //
//////////////////////////////////////////////////////

if (Meteor.isServer) {
  Movies.publish("movies.list");
}
