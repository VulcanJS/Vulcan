import React from 'react';
import {mount} from 'react-mounter';

// ------------------------------------- Posts -------------------------------- //

FlowRouter.route('/', {
  name: 'posts.list',
  action(params, queryParams) {

    ({AppContainer, ListContainer, PostList} = Telescope.components);
    queryParams = _.isEmpty(queryParams) ? {view: 'new'} : queryParams;
    ({selector, options} = Posts.parameters.get(queryParams));

    mount(AppContainer, {content: 
      <ListContainer 
        collection={Posts} 
        publication="posts.list"
        selector={selector}
        options={options}
        terms={queryParams} 
        joins={Posts.getJoins()}
      ><PostList/></ListContainer>})
  }
});

FlowRouter.route('/posts/:_id', {
  name: 'posts.single',
  action(params, queryParams) {
    ({AppContainer, ItemContainer, Post} = Telescope.components);
    mount(AppContainer, {content: 
      <ItemContainer 
        collection={Posts} 
        publication="posts.single" 
        selector={params}
        terms={params}
        joins={Posts.getJoins()}
      ><Post/></ItemContainer>});
  }
});

// FlowRouter.route('/posts/:_id/edit', {
//   name: 'posts.edit',
//   action(params, queryParams) {
//     ({AppContainer, ItemContainer} = Telescope.components);
//     mount(AppContainer, {content: <ItemContainer
//       collection={Posts} 
//       publication="posts.single" 
//       selector={{_id: params._id}}
//       terms={params}
//       component={PostEdit}
//     ><PostEdit/></ItemContainer>});
//   }
// });

FlowRouter.route('/users/:slug', {
  name: 'users.single',
  action(params, queryParams) {
    ({AppContainer, ItemContainer, UsersSingle} = Telescope.components);
    mount(AppContainer, {content: 
      <ItemContainer 
        collection={Users} 
        publication="users.single" 
        selector={{'telescope.slug': params.slug}}
        terms={{'telescope.slug': params.slug}}
      ><UsersSingle/></ItemContainer>});
  }
});

FlowRouter.route('/account', {
  name: 'account',
  action(params, queryParams) {
    ({AppContainer, ItemContainer, UsersEdit} = Telescope.components);
    mount(AppContainer, {content: 
      <ItemContainer 
        collection={Users} 
        publication="users.single" 
        selector={{_id: Meteor.userId()}} 
        terms={{_id: Meteor.userId()}} 
        component={UsersEdit}
      ><UsersEdit/></ItemContainer>});
  }
});

FlowRouter.route('/users/:slug/edit', {
  name: 'users.edit',
  action(params, queryParams) {
    ({AppContainer, ItemContainer, UsersEdit} = Telescope.components);
    mount(AppContainer, {content: 
      <ItemContainer 
        collection={Users} 
        publication="users.single" 
        selector={params} 
        terms={params} 
        component={UsersEdit}
      ><UsersEdit/></ItemContainer>});
  }
});


// ------------------------------------- Comments -------------------------------- //

// FlowRouter.route('/comments/:_id', {
//   name: "commentPage",
//   action: function(params, queryParams) {
//     BlazeLayout.render("layout", {main: "comment_controller", commentTemplate: "comment_reply"});
//   }
// });

// FlowRouter.route('/comments/:_id/edit', {
//   name: "commentEdit",
//   action: function(params, queryParams) {
//     BlazeLayout.render("layout", {main: "comment_controller", commentTemplate: "comment_edit"});
//   }
// });

// ------------------------------------- Users -------------------------------- //

// Telescope.adminRoutes.route('/users', {
//   name: "adminUsers",
//   action: function(params, queryParams) {
//     BlazeLayout.render("layout", {main: "admin_wrapper", admin: "users_dashboard"});
//   }
// });

// FlowRouter.route('/users/:_idOrSlug', {
//   name: "userProfile",
//   action: function(params, queryParams) {
//     BlazeLayout.render("layout", {main: "user_controller", userTemplate: "user_profile"});
//   }
// });

// FlowRouter.route('/users/:_idOrSlug/edit', {
//   name: "userEdit",
//   action: function(params, queryParams) {
//     BlazeLayout.render("layout", {main: "user_controller", userTemplate: "user_edit"});
//   }
// });

// FlowRouter.route('/account', {
//   name: "userAccountShortcut",
//   triggersEnter: [function(context, redirect) {
//     redirect("userEdit", {_idOrSlug: Meteor.userId()});
//   }]
// });

// FlowRouter.route('/sign-out', {
//   name: "signOut",
//   triggersEnter: [function(context, redirect) {
//     AccountsTemplates.logout();
//     Messages.flash(i18n.t("you_have_been_logged_out"));
//   }]
// });