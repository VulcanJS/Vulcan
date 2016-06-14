import React from 'react';
import { ListContainer, DocumentContainer } from "meteor/utilities:react-list-container";

const PostsHome = (props, context) => {

  const params = _.isEmpty(props.location.query) ? {view: 'top'} : _.clone(props.location.query);
  params.listId = "posts.list.main";
  
  const {selector, options} = Posts.parameters.get(params);

  return (
    <ListContainer 
      collection={Posts} 
      publication="posts.list"
      selector={selector}
      options={options}
      terms={params} 
      joins={Posts.getJoins()}
      component={Telescope.components.PostsList}
      cacheSubscription={false}
      listId={params.listId}
      limit={Telescope.settings.get("postsPerPage", 10)}
    />
  )

};

PostsHome.displayName = "PostsHome";

module.exports = PostsHome;