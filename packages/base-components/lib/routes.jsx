import React from 'react';
import Router from './router.js'
import {mount} from 'react-mounter';


// ------------------------------------- Posts -------------------------------- //

Router.route('/', {
  name: 'posts.list',
  action(params, queryParams) {

    ({App, ListContainer, PostList} = Telescope.components);
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
    ({App, DocumentContainer, PostPage} = Telescope.components);
    mount(App, {content: 
      <DocumentContainer 
        collection={Posts} 
        publication="posts.single" 
        selector={params}
        terms={params}
        joins={Posts.getJoins()}
        component={PostPage}
      />});
  }
});

// Router.route('/posts/:_id/edit', {
//   name: 'posts.edit',
//   action(params, queryParams) {
//     ({App, DocumentContainer} = Telescope.components);
//     mount(App, {content: <DocumentContainer
//       collection={Posts} 
//       publication="posts.single" 
//       selector={{_id: params._id}}
//       terms={params}
//       component={PostEdit}
//     ><PostEdit/></DocumentContainer>});
//   }
// });

Router.route('/users/:slug', {
  name: 'users.single',
  action(params, queryParams) {
    ({App, DocumentContainer, UserSingle} = Telescope.components);
    mount(App, {content: 
      <DocumentContainer 
        collection={Users} 
        publication="users.single" 
        selector={{'telescope.slug': params.slug}}
        terms={{'telescope.slug': params.slug}}
        component={UserSingle}
      />});
  }
});

Router.route('/account', {
  name: 'account',
  action(params, queryParams) {
    ({App, DocumentContainer, UserEdit} = Telescope.components);
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
    ({App, DocumentContainer, UserEdit} = Telescope.components);
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

Router.route('/cheatsheet', {
  name: 'cheatsheet',
  action() {
    ({App, Cheatsheet} = Telescope.components);
    mount(App, {content: <Cheatsheet/>});
  }
});

// ------------------------------------- Comments -------------------------------- //

// Router.route('/comments/:_id', {
//   name: "commentPage",
//   action: function(params, queryParams) {
//     BlazeLayout.render("layout", {main: "comment_controller", commentTemplate: "comment_reply"});
//   }
// });

// Router.route('/comments/:_id/edit', {
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

// Router.route('/users/:_idOrSlug', {
//   name: "userProfile",
//   action: function(params, queryParams) {
//     BlazeLayout.render("layout", {main: "user_controller", userTemplate: "user_profile"});
//   }
// });

// Router.route('/users/:_idOrSlug/edit', {
//   name: "userEdit",
//   action: function(params, queryParams) {
//     BlazeLayout.render("layout", {main: "user_controller", userTemplate: "user_edit"});
//   }
// });

// Router.route('/account', {
//   name: "userAccountShortcut",
//   triggersEnter: [function(context, redirect) {
//     redirect("userEdit", {_idOrSlug: Meteor.userId()});
//   }]
// });

// Router.route('/sign-out', {
//   name: "signOut",
//   triggersEnter: [function(context, redirect) {
//     AccountsTemplates.logout();
//     Messages.flash(i18n.t("you_have_been_logged_out"));
//   }]
// });