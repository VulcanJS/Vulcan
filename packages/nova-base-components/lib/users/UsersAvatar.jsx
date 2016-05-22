import React, { PropTypes, Component } from 'react';
// import Avatar from 'meteor-avatar-core';
import { Avatar } from 'meteor/nova:core';

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

  const avatarUrl = Avatar.getUrl(user);

  const img = <img alt={Users.getDisplayName(user)} style={imgStyle} className="avatar" src={Avatar.getUrl(user)}/>;
  const initials = <span className="avatar-initials"><span>{Avatar.getInitials(user)}</span></span>;

  const avatar = avatarUrl ? img : initials;

  return link ? <a style={aStyle} className="users-avatar" href={Users.getProfileUrl(user)}>{avatar}</a> : avatar;

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

module.exports = UsersAvatar;
export default UsersAvatar;