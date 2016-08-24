// import Telescope from 'meteor/nova:lib';
// import React, { PropTypes, Component } from 'react';
// import { ListContainer } from "meteor/utilities:react-list-container";
// import Posts from "meteor/nova:posts";

// class PostsSubscribedList extends Component {

//   render() {

//     const params = {view: 'userSubscribedPosts', userId: Meteor.userId(), listId: "posts.list.subscribed"};
//     const {selector, options} = Posts.parameters.get(params);

//     return (
//       <ListContainer
//         collection={Posts}
//         publication="posts.list"
//         selector={selector}
//         options={options}
//         terms={params}
//         joins={Posts.getJoins()}
//         component={Telescope.components.PostsList}
//         cacheSubscription={false}
//         listId={params.listId}
//         limit={Telescope.settings.get("postsPerPage", 10)}
//       />
//     )
//   }
// };

// module.exports = PostsSubscribedList;
