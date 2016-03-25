import React, { PropTypes, Component } from 'react';

const UserAvatar = ({user, size}) => {

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
    width: "100%",
    height: "100%",
    display: "block"
  }; 

  console.log(user)
  console.log(Avatar.getUrl(user))
  
  return (
    <a style={aStyle} className="user-avatar" href={Users.getProfileUrl(user)}>
      <img alt={Users.getDisplayName(user)} style={imgStyle} className="avatar" src={Avatar.getUrl(user)}/>
    </a>
  )
}

UserAvatar.propTypes = {
  user: React.PropTypes.object.isRequired,
  size: React.PropTypes.string
}

UserAvatar.defaultProps = {
  size: "medium"
}

module.exports = UserAvatar;
export default UserAvatar;