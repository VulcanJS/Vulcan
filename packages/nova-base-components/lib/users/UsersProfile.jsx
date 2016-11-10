import Telescope from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import { FormattedMessage } from 'react-intl';
import Posts from "meteor/nova:posts";
import Users from 'meteor/nova:users';
import { Link } from 'react-router';


const UsersProfile = (props) => {

  const user = props.document;
  const twitterName = Users.getTwitterName(user);

  const terms = {view: "userPosts", userId: user._id};
  const {selector, options} = Posts.parameters.get(terms);

  return (
    <div className="page users-profile">
      <Telescope.components.HeadTags url={Users.getProfileUrl(user, true)} title={Users.getDisplayName(user)} description={user.__bio} />
      <h2 className="page-title">{Users.getDisplayName(user)}</h2>
      <p>{user.__bio}</p>
      <ul>
        {twitterName ? <li><a href={"http://twitter.com/" + twitterName}>@{twitterName}</a></li> : null }
        {user.__website ? <li><a href={user.__website}>{user.__website}</a></li> : null }
        <Telescope.components.CanDo document={user} action="users.edit">
          <li><Link to={Users.getEditUrl(user)}><FormattedMessage id="users.edit_account"/></Link></li>
        </Telescope.components.CanDo>
      </ul>
      <h3><FormattedMessage id="users.posts"/></h3>
      <Telescope.components.PostsListContainer terms={terms} component={Telescope.components.PostsList} />
    </div>
  )
}

UsersProfile.propTypes = {
  document: React.PropTypes.object.isRequired,
}

UsersProfile.displayName = "UsersProfile";

module.exports = UsersProfile;
