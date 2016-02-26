import {mount} from 'react-mounter';
// import {Demo} from './demo-component.jsx';

FlowRouter.route('/demo', {
  name: 'posts.single',
  action(params, queryParams) {

    ({AppContainer, ListContainer} = Telescope.components);
    
    mount(AppContainer, {content: 
      <ListContainer 
        collection={Movies} 
        publication="movies.list"
        terms={{options: {sort: {createdAt: -1}}}}
        options={{sort: {createdAt: -1}}}
        joins={Posts.simpleSchema().getJoins()}
      >
        <MoviesList/>
      </ListContainer>
    });

  }
});

Movies = new Mongo.Collection("movies");

const hasUserId = function (userId) {
  return !!userId;
}

const isOwner = function (userId, document) {
  return userId === document.userId;
}

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
    publish: false,
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
      collection: function () {return Meteor.users}
    }
  }
});

Movies.attachSchema(schema);

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

if (Meteor.isServer) {
  Movies.publish("movies.list");
}
