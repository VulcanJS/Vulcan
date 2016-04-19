import React, { PropTypes, Component } from 'react';

const UsersProfile = ({user, currentUser}) => {

  ({HeadTags} = Telescope.components);

  return (
    <div className="page users-profile">
      <HeadTags url={Users.getProfileUrl(user, true)} title={Users.getDisplayName(user)} description={user.telescope.bio} />
      <h2>{Users.getDisplayName(user)}</h2>
      <p>{user.telescope.bio}</p>
      <ul>
        {user.telescope.twitterUsername ? <li><a href={"http://twitter.com/" + user.telescope.twitterUsername}>@{user.telescope.twitterUsername}</a></li> : null }
        {user.telescope.website ? <li><a href={user.telescope.website}>{user.telescope.website}</a></li> : null }
      </ul>
    </div>
  )
}

UsersProfile.propTypes = {
  user: React.PropTypes.object.isRequired,
  currentUser: React.PropTypes.object
}

module.exports = UsersProfile;