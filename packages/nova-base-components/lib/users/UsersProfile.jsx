import React, { PropTypes, Component } from 'react';
import SmartContainers from "meteor/utilities:react-list-container";
const ListContainer = SmartContainers.ListContainer;

const UsersProfile = ({user, currentUser}) => {

  ({HeadTags, PostsList} = Telescope.components);

  const twitterName = Users.getTwitterName(user);

  const terms = {view:"userPosts", userId: user._id};
  const {selector, options} = Posts.parameters.get(terms);

  return (
    <div className="page users-profile">
      <HeadTags url={Users.getProfileUrl(user, true)} title={Users.getDisplayName(user)} description={user.telescope.bio} />
      <h2>{Users.getDisplayName(user)}</h2>
      <p>{user.telescope.bio}</p>
      <ul>
        {twitterName ? <li><a href={"http://twitter.com/" + twitterName}>@{twitterName}</a></li> : null }
        {user.telescope.website ? <li><a href={user.telescope.website}>{user.telescope.website}</a></li> : null }
      </ul>
      <h3>Posts</h3>
      <ListContainer
        collection={Posts}
        publication="posts.list"
        terms={terms}
        selector={selector}
        options={options}
        joins={Posts.getJoins()}
        cacheSubscription={false}
        component={PostsList}
        componentProps={{showHeader: false}}
      />
    </div>
  )
}

UsersProfile.propTypes = {
  user: React.PropTypes.object.isRequired,
  currentUser: React.PropTypes.object
}

module.exports = UsersProfile;