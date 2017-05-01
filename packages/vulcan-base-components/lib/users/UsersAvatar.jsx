import { registerComponent } from 'meteor/vulcan:core';
import React, { PropTypes, Component } from 'react';
import Users from 'meteor/vulcan:users';
import { Link } from 'react-router';

const UsersAvatar = ({user, size, link}) => {

  const sizes = {
    small: "20px",
    medium: "30px",
    large: "50px"
  }

  const aStyle = {
    borderRadius: "100%",
    display: "inline-block",
    height: sizes[size],
    width: sizes[size]
  };

  const imgStyle = {
    borderRadius: "100%",
    display: "block",
    height: sizes[size],
    width: sizes[size]
  };

  const avatarUrl = user.avatarUrl || Users.avatar.getUrl(user);

  const img = <img alt={Users.getDisplayName(user)} style={imgStyle} className="avatar" src={avatarUrl} title={user.username}/>;
  const initials = <span className="avatar-initials"><span>{Users.avatar.getInitials(user)}</span></span>;

  const avatar = avatarUrl ? img : initials;

  return link ? <Link style={aStyle} className="users-avatar" to={Users.getProfileUrl(user)}>{avatar}</Link> : avatar;

}

UsersAvatar.propTypes = {
  user: React.PropTypes.object.isRequired,
  size: React.PropTypes.string,
  link: React.PropTypes.bool
}

UsersAvatar.defaultProps = {
  size: "medium",
  link: true
}

UsersAvatar.displayName = "UsersAvatar";

registerComponent('UsersAvatar', UsersAvatar);
