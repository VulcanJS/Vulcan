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

    ({App, PostList} = Telescope.components);
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
        component={PostList}
        cacheSubscription={false}
      />})
  }
});

Router.route('/daily/:days?', {
  name: 'posts.daily',
  action(params, queryParams) {

    ({App, PostDaily} = Telescope.components);

    mount(App, {content: <PostDaily days={params.days}/>})
  }
});

Router.route('/posts/:_id/:slug?', {
  name: 'posts.single',
  action(params, queryParams) {
    ({App, PostPage} = Telescope.components);
    mount(App, {content: 
      <DocumentContainer 
        collection={Posts} 
        publication="posts.single" 
        selector={{_id: params._id}}
        terms={params}
        joins={Posts.getJoins()}
        component={PostPage}
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
    ({App, UserEdit} = Telescope.components);
    mount(App, {content: 
      <DocumentContainer 
        collection={Users} 
        publication="users.single" 
        selector={{_id: Meteor.userId()}} 
        terms={{_id: Meteor.userId()}} 
        component={UserEdit}
      />});
  }
});

Router.route('/users/:slug/edit', {
  name: 'users.edit',
  action(params, queryParams) {
    ({App, UserEdit} = Telescope.components);
    mount(App, {content: 
      <DocumentContainer 
        collection={Users} 
        publication="users.single" 
        selector={params} 
        terms={params} 
        component={UserEdit}
      />});
  }
});

// ------------------------------------- Other -------------------------------- //

Router.route('/cheatsheet', {
  name: 'cheatsheet',
  action() {
    ({App, Cheatsheet} = Telescope.components);
    mount(App, {content: <Cheatsheet/>});
  }
});

Router.route('/settings', {
  name: 'settings',
  action() {
    ({App, Settings} = Telescope.components);
    mount(App, {content: <Settings/>});
  }
});

FlowRouter.notFound = {
  action() {
    ({Error404} = Telescope.components);
    mount(App, {content: <Error404/>});
  }
};