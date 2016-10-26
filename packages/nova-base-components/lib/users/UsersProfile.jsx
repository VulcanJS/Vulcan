import Telescope from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { ListContainer } from "meteor/utilities:react-list-container";
import Posts from "meteor/nova:posts";
import Users from 'meteor/nova:users';
import { Link } from 'react-router';

import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const UsersProfilePostsList = (props, context) => {

  const {loading, posts, refetch} = props.data;
  return loading ? 
    <Telescope.components.Loading/> : 
    <Telescope.components.PostsList 
      results={posts}
      hasMore={true}
      ready={true}
      count={10}
      totalCount={20}
      loadMore={()=>{console.log("load more")}}
      refetchQuery={refetch}
    />;
};

UsersProfilePostsList.propTypes = {
  data: React.PropTypes.shape({
    loading: React.PropTypes.bool,
    posts: React.PropTypes.array,
  }).isRequired,
  params: React.PropTypes.object
};

UsersProfilePostsList.contextTypes = {
  currentUser: React.PropTypes.object
};

UsersProfilePostsList.displayName = "UsersProfilePostsList";

const UsersProfilePostsListWithData = graphql(gql`
  query getPosts($terms: Terms, $offset: Int, $limit: Int) {
    posts(terms: $terms, offset: $offset, limit: $limit) {
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
        // get the view from the query params or ask for the 'top' one as a default
        terms: ownProps.terms,
        offset: 0,
        limit: 10
      },
      pollInterval: 20000,
    };
  },
})(UsersProfilePostsList);

const UsersProfile = ({user}, {currentUser}) => {

  const twitterName = Users.getTwitterName(user);

  const terms = {view: "userPosts", userId: user._id};
  const {selector, options} = Posts.parameters.get(terms);

  return (
    <div className="page users-profile">
      <Telescope.components.HeadTags url={Users.getProfileUrl(user, true)} title={Users.getDisplayName(user)} description={user.telescope.bio} />
      <h2 className="page-title">{Users.getDisplayName(user)}</h2>
      <p>{user.telescope.bio}</p>
      <ul>
        {twitterName ? <li><a href={"http://twitter.com/" + twitterName}>@{twitterName}</a></li> : null }
        {user.telescope.website ? <li><a href={user.telescope.website}>{user.telescope.website}</a></li> : null }
        <Telescope.components.CanDo document={user} action="users.edit">
          <li><Link to={Users.getEditUrl(user)}><FormattedMessage id="users.edit_account"/></Link></li>
        </Telescope.components.CanDo>
      </ul>
      <h3><FormattedMessage id="users.posts"/></h3>
      <UsersProfilePostsListWithData terms={terms} />
    </div>
  )
}

UsersProfile.propTypes = {
  user: React.PropTypes.object.isRequired,
}

UsersProfile.contextTypes = {
  currentUser: React.PropTypes.object
}

UsersProfile.displayName = "UsersProfile";

module.exports = UsersProfile;

// <ListContainer
//   collection={Posts}
//   publication="posts.list"
//   terms={terms}
//   selector={selector}
//   options={options}
//   joins={Posts.getJoins()}
//   cacheSubscription={false}
//   component={Telescope.components.PostsList}
//   componentProps={{showHeader: false}}
//   listId="posts.list.user"
// />