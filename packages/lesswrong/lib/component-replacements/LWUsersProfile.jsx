import { Components, replaceComponent, ModalTrigger } from 'meteor/vulcan:core';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router';
import Users from "meteor/vulcan:users";

const LWUsersProfile = (props) => {
  if (props.loading) {

    return <div className="page users-profile"><Components.Loading/></div>

  } else if (!props.document) {

    console.log(`// missing user (_id/slug: ${props.documentId || props.slug})`);
    return <div className="page users-profile"><FormattedMessage id="app.404"/></div>

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
          <Components.ShowIf check={Users.options.mutations.edit.check} document={user}>
            <li><Link to={Users.getEditUrl(user)}><FormattedMessage id="users.edit_account"/></Link></li>
          </Components.ShowIf>
          <li><Components.SubscribeTo document={user} /></li>
          <li>
            <ModalTrigger label="Send Message" >
              <Components.newConversationButton user={user} />
            </ModalTrigger>
          </li>
          <li>
            <ModalTrigger label="Register new RSS Feed" >
              <Components.newFeedButton user={user} />
            </ModalTrigger>
          </li>
        </ul>
        <h3><FormattedMessage id="users.posts"/></h3>
        <Components.PostsList terms={terms} />
      </div>
    )
  }
}

LWUsersProfile.propTypes = {
  // document: React.PropTypes.object.isRequired,
}

LWUsersProfile.displayName = "UsersProfile";

const options = {
  collection: Users,
  queryName: 'usersSingleQuery',
  fragmentName: 'UsersProfile',
};

replaceComponent('UsersProfile', LWUsersProfile);
