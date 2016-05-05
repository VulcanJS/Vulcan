import React, { PropTypes, Component } from 'react';
import SmartContainers from "meteor/utilities:react-list-container";
const ListContainer = SmartContainers.ListContainer;

const UserProfile = ({user, currentUser}) => {

  ({HeadTags, PostsList} = Telescope.components);

  return (
    <div className="page user-profile">
      <HeadTags url={Users.getProfileUrl(user, true)} title={Users.getDisplayName(user)} description={user.telescope.bio} />
      <h2>{Users.getDisplayName(user)}</h2>
      <p>{user.telescope.bio}</p>
      <ul>
        {user.telescope.twitterUsername ? <li><a href={"http://twitter.com/" + user.telescope.twitterUsername}>@{user.telescope.twitterUsername}</a></li> : null }
        {user.telescope.website ? <li><a href={user.telescope.website}>{user.telescope.website}</a></li> : null }
      </ul>

      <ListContainer
        collection={Posts}
        publication="posts.list"
        terms={{view:"userPosts", userId: user._id}}
        joins={Posts.getJoins()}
        component={PostsList}
        cacheSubscription={false}
        componentProps={{showHeader: false}}
      />

    </div>
  )
}

UserProfile.propTypes = {
  user: React.PropTypes.object.isRequired,
  currentUser: React.PropTypes.object
}

module.exports = UserProfile;
