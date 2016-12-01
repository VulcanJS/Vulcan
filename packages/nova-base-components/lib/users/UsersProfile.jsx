import Telescope from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import { FormattedMessage } from 'react-intl';
import Posts from "meteor/nova:posts";
import Users from 'meteor/nova:users';
import { Link } from 'react-router';
import { withSingle } from 'meteor/nova:core';
import gql from 'graphql-tag';

const UsersProfile = (props) => {
  if (props.loading) {
    
    return <div className="page users-edit-form"><Telescope.components.Loading/></div>
  
  } else {

    const user = props.document;
    const twitterName = Users.getTwitterName(user);

    const terms = {view: "userPosts", userId: user._id};

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
        <Telescope.components.PostsList terms={terms} />
      </div>
    )
  }
}

UsersProfile.propTypes = {
  // document: React.PropTypes.object.isRequired,
}

UsersProfile.displayName = "UsersProfile";

UsersProfile.fragment = gql`
  fragment usersSingleFragment on User {
    _id
    username
    createdAt
    isAdmin
    __bio
    __commentCount
    __displayName
    __downvotedComments {
      itemId
      power
      votedAt
    }
    __downvotedPosts {
      itemId
      power
      votedAt
    }
    __email
    __emailHash
    __groups
    __htmlBio
    __karma
    __newsletter_subscribeToNewsletter
    __notifications_users
    __notifications_posts
    __postCount
    __slug
    __twitterUsername
    __upvotedComments {
      itemId
      power
      votedAt
    }
    __upvotedPosts {
      itemId
      power
      votedAt
    }
    __website
  }
`;

const options = {
  collection: Users,
  queryName: 'usersSingleQuery',
  fragment: UsersProfile.fragment,
};

Telescope.registerComponent('UsersProfile', UsersProfile, withSingle(options));
