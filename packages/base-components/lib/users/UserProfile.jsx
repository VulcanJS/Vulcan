import React, { PropTypes, Component } from 'react';

const UserProfile = ({user, currentUser}) => {
  return (
    <div className="page user-profile">
      <h2>{Users.getDisplayName(user)}</h2>
      <p>{user.telescope.bio}</p>
      <ul>
        {user.telescope.twitterUsername ? <li><a href={"http://twitter.com/" + user.telescope.twitterUsername}>@{user.telescope.twitterUsername}</a></li> : null }
        {user.telescope.website ? <li><a href={user.telescope.website}>{user.telescope.website}</a></li> : null }
      </ul>
    </div>
  )
}

UserProfile.propTypes = {
  user: React.PropTypes.object.isRequired,
  currentUser: React.PropTypes.object
}

module.exports = UserProfile;