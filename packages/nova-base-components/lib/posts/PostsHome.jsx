import Telescope from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import { ListContainer } from "meteor/utilities:react-list-container";
import Posts from "meteor/nova:posts";

import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const PostsHome = (props, context) => {

  const {loading, posts} = props.data;

  return loading ? 
    <Telescope.components.Loading/> : 
    <Telescope.components.PostsList 
      results={posts}
      hasMore={true}
      ready={true}
      count={10}
      totalCount={20}
      loadMore={()=>{console.log("load more")}}
    />;
};


PostsHome.propTypes = {
  data: React.PropTypes.shape({
    loading: React.PropTypes.bool,
    posts: React.PropTypes.array,
  }).isRequired,
  params: React.PropTypes.object
};

PostsHome.contextTypes = {
  currentUser: React.PropTypes.object
};

//

/*
 TODO: add arguments
  query getPosts($view: String, $offset: Int, $limit: Int) {
    posts(view: $view, offset: $offset, limit: $limit) {
*/

const PostsHomeWithData = graphql(gql`
  query getPosts {
    posts {
      _id
      title
      url
      slug
      htmlBody
      thumbnailUrl
      baseScore
      postedAt
      sticky
      categories {
        _id
        name
        slug
      }
      commentCount
      upvoters {
        _id
      }
      downvoters {
        _id
      }
      upvotes # should be asked only for admins?
      score # should be asked only for admins?
      viewCount # should be asked only for admins?
      clickCount # should be asked only for admins?
      user {
        _id
        telescope {
          displayName
          slug
          emailHash
        }
      }
    }
  }

`, {
  options(ownProps) {
    return {
      variables: { 
        view: 'top',
        offset: 0,
        limit: 10
      }
    };
  },
})(PostsHome);

PostsHome.displayName = "PostsHome";

module.exports = PostsHomeWithData;

// TODO: remove old code

// class PostsHome extends Component {

//   getDefaultView() {
//     return {view: 'top'}
//   }
  
//   render() {

//     const params = {...this.getDefaultView(), ...this.props.location.query, listId: "posts.list.main"};
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
//         cacheSubscription={true}
//         listId={params.listId}
//         limit={Telescope.settings.get("postsPerPage", 10)}
//       />
//     )
//   }
// };