import React from 'react';
import Router from './router.js'
import {mount} from 'react-mounter';

import SmartContainers from "meteor/utilities:react-list-container";
const DocumentContainer = SmartContainers.DocumentContainer;
const ListContainer = SmartContainers.ListContainer;

// ------------------------------------- Posts -------------------------------- //

Router.route('/', {
  name: 'posts.list',
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
});

Router.route('/daily/:days?', {
  name: 'posts.daily',
  action(params, queryParams) {

    ({App, PostsDaily} = Telescope.components);

    mount(App, {content: <PostsDaily days={params.days}/>})
  }
});

Router.route('/posts/:_id/:slug?', {
  name: 'posts.single',
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
});

// ------------------------------------- Users -------------------------------- //

Router.route('/users/:slug', {
  name: 'users.single',
  action(params, queryParams) {
    ({App, UserProfile} = Telescope.components);
    mount(App, {content: 
      <DocumentContainer 
        collection={Users} 
        publication="users.single" 
        selector={{'telescope.slug': params.slug}}
        terms={{'telescope.slug': params.slug}}
        component={UserProfile}
        documentPropName="user"
      />});
  }
});

Router.route('/account', {
  name: 'account',
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
});

Router.route('/users/:slug/edit', {
  name: 'users.edit',
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
});

// ------------------------------------- Other -------------------------------- //

FlowRouter.notFound = {
  action() {
    ({App, Error404} = Telescope.components);
    mount(App, {content: <Error404/>});
  }
};