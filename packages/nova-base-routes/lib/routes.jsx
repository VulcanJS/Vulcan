import React from 'react';
import {mount} from 'react-mounter';

import SmartContainers from "meteor/utilities:react-list-container";
const DocumentContainer = SmartContainers.DocumentContainer;
const ListContainer = SmartContainers.ListContainer;

Telescope.routes = {};

Telescope.addRoutes = (newRoutes) => {
  Telescope.routes = Object.assign(Telescope.routes, newRoutes);
}

Telescope.addRoutes({

  // ------------------------------------- Posts -------------------------------- //

  "posts.list": {
    path: "/",
    action(params, queryParams) {

      ({App, PostsList} = Telescope.components);
      queryParams = _.isEmpty(queryParams) ? {view: 'new'} : _.clone(queryParams);
      ({selector, options} = Posts.parameters.get(queryParams));

      mount(App, {content: 
        <ListContainer 
          collection={Posts} 
          publication="posts.list"
          selector={selector}
          options={options}
          terms={queryParams} 
          joins={Posts.getJoins()}
          component={PostsList}
          cacheSubscription={false}
        />})
    }
  },

  "posts.daily": {
    path: "/daily/:days?",
    action(params, queryParams) {

      ({App, PostsDaily} = Telescope.components);

      mount(App, {content: <PostsDaily days={params.days}/>})
    }
  },

  "posts.single": {
    path: "/posts/:_id/:slug?",
    action(params, queryParams) {
      ({App, PostsPage} = Telescope.components);
      mount(App, {content: 
        <DocumentContainer 
          collection={Posts} 
          publication="posts.single" 
          selector={{_id: params._id}}
          terms={params}
          joins={Posts.getJoins()}
          component={PostsPage}
        />});
    }    
  },

  // ------------------------------------- Users -------------------------------- //

  "users.single": {
    path: "/users/:slug",
    action(params, queryParams) {
      ({App, UsersProfile} = Telescope.components);
      mount(App, {content: 
        <DocumentContainer 
          collection={Users} 
          publication="users.single" 
          selector={{'telescope.slug': params.slug}}
          terms={{'telescope.slug': params.slug}}
          component={UsersProfile}
          documentPropName="user"
        />});
    }
  },

  "account": {
    path: "/account",
    action(params, queryParams) {
      ({App, UsersEdit} = Telescope.components);
      mount(App, {content: 
        <DocumentContainer 
          collection={Users} 
          publication="users.single" 
          selector={{_id: Meteor.userId()}} 
          terms={{_id: Meteor.userId()}} 
          component={UsersEdit}
        />});
    }
  },

  "users.edit": {
    path: "/users/:slug/edit",
    action(params, queryParams) {
      ({App, UsersEdit} = Telescope.components);
      mount(App, {content: 
        <DocumentContainer 
          collection={Users} 
          publication="users.single" 
          selector={params} 
          terms={params} 
          component={UsersEdit}
        />});
    }
  }  
});

_.forEach(Telescope.routes, (route, routeName) => {
  FlowRouter.route(route.path, {
    name: routeName,
    action: route.action
  });
});

// ------------------------------------- Other -------------------------------- //

FlowRouter.notFound = {
  action() {
    ({App, Error404} = Telescope.components);
    mount(App, {content: <Error404/>});
  }
};