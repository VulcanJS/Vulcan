import { Components, registerComponent } from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import { FormattedMessage } from 'react-intl';
import Users from 'meteor/nova:users';
import { Link } from 'react-router';
import { ShowIf, withDocument, withCurrentUser } from 'meteor/nova:core';
import gql from 'graphql-tag';

const UsersProfile = (props) => {
  if (props.loading) {

    return <div className="page users-profile"><Components.Loading/></div>

  } else {

    const user = props.document;

    const terms = {view: "userPosts", userId: user._id};

    return (
      <div className="page users-profile">
        <Components.HeadTags url={Users.getProfileUrl(user, true)} title={Users.getDisplayName(user)} />
        <h2 className="page-title">{Users.getDisplayName(user)}</h2>
        {user.__htmlBio ? <div dangerouslySetInnerHTML={{__html: user.__htmlBio}}></div> : null }
        <ul>
          {user.twitterUsername ? <li><a href={"http://twitter.com/" + user.twitterUsername}>@{user.twitterUsername}</a></li> : null }
          {user.__website ? <li><a href={user.__website}>{user.__website}</a></li> : null }
          <ShowIf check={Users.options.mutations.edit.check} document={user}>
            <li><Link to={Users.getEditUrl(user)}><FormattedMessage id="users.edit_account"/></Link></li>
          </ShowIf>
        </ul>
        <h3><FormattedMessage id="users.posts"/></h3>
        <Components.PostsList terms={terms} />
      </div>
    )
  }
}

UsersProfile.propTypes = {
  // document: React.PropTypes.object.isRequired,
}

UsersProfile.displayName = "UsersProfile";

UsersProfile.fragment = gql`
  fragment usersProfileFragment on User {
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
    __emailHash
    __groups
    __htmlBio
    __karma
    __newsletter_subscribeToNewsletter
    __notifications_users
    __notifications_posts
    __postCount
    __slug
    twitterUsername
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

registerComponent('UsersProfile', UsersProfile, withCurrentUser, withDocument(options));
