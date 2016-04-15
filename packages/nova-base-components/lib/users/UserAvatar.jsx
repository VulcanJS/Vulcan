import React, { PropTypes, Component } from 'react';

const UserAvatar = ({user, size, link}) => {

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

  const img = <img alt={Users.getDisplayName(user)} style={imgStyle} className="avatar" src={Avatar.getUrl(user)}/>;

  return link ? <a style={aStyle} className="user-avatar" href={Users.getProfileUrl(user)}>{img}</a> : img;

}

UserAvatar.propTypes = {
  user: React.PropTypes.object.isRequired,
  size: React.PropTypes.string,
  link: React.PropTypes.bool
}

UserAvatar.defaultProps = {
  size: "medium",
  link: true
}

module.exports = UserAvatar;
export default UserAvatar;