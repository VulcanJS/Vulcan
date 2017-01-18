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
        {user.htmlBio ? <div dangerouslySetInnerHTML={{__html: user.htmlBio}}></div> : null }
        <ul>
          {user.twitterUsername ? <li><a href={"http://twitter.com/" + user.twitterUsername}>@{user.twitterUsername}</a></li> : null }
          {user.website ? <li><a href={user.website}>{user.website}</a></li> : null }
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
    bio
    commentCount
    displayName
    downvotedComments {
      itemId
      power
      votedAt
    }
    downvotedPosts {
      itemId
      power
      votedAt
    }
    emailHash
    groups
    htmlBio
    karma
    newsletter_subscribeToNewsletter
    notifications_users
    notifications_posts
    postCount
    slug
    twitterUsername
    upvotedComments {
      itemId
      power
      votedAt
    }
    upvotedPosts {
      itemId
      power
      votedAt
    }
    website
  }
`;

const options = {
  collection: Users,
  queryName: 'usersSingleQuery',
  fragment: UsersProfile.fragment,
};

registerComponent('UsersProfile', UsersProfile, withCurrentUser, withDocument(options));
