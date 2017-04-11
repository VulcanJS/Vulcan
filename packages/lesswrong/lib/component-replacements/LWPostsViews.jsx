import { Components, replaceComponent } from 'meteor/vulcan:core';
import { registerComponent, withCurrentUser } from 'meteor/vulcan:core';
import React, { PropTypes, Component } from 'react';
import { FormattedMessage, intlShape } from 'react-intl';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { withRouter } from 'react-router'
import Users from 'meteor/vulcan:users';

const LWPostsViews = (props, context) => {

  let views = ["top", "new", "best"];
  const adminViews = ["pending", "rejected", "scheduled", "all_draft"];

  if (Users.canDo(props.currentUser, "posts.edit.own")
  || Users.canDo(props.currentUser, "posts.edit.all")) {
    views = views.concat(["draft"]);
  }

  if (Users.canDo(props.currentUser, "posts.edit.all")) {
    views = views.concat(adminViews);
  }

  const query = _.clone(props.router.location.query);

  return (
    <div className="posts-views">
      <DropdownButton
        bsStyle="default"
        className="views btn-secondary"
        title={context.intl.formatMessage({id: "posts.view"})}
        id="views-dropdown"
      >
        {views.map(view =>
          <LinkContainer key={view}
            to={
              (props.currentUser) ?
              {pathname: "/", query: {...query, view: view, userId: props.currentUser._id}} :
              {pathname: "/", query: {...query, view: view}}
            }
            className="dropdown-item">
            <MenuItem>
              <FormattedMessage id={"posts."+view}/>
            </MenuItem>
          </LinkContainer>
        )}
        <LinkContainer to={"/daily"} className="dropdown-item">
          <MenuItem className={"bar"}>
            <FormattedMessage id="posts.daily"/>
          </MenuItem>
        </LinkContainer>
      </DropdownButton>
    </div>
  )
}

LWPostsViews.propTypes = {
  currentUser: React.PropTypes.object,
  defaultView: React.PropTypes.string
};

LWPostsViews.defaultProps = {
  defaultView: "top"
};

LWPostsViews.contextTypes = {
  currentRoute: React.PropTypes.object,
  intl: intlShape
};

LWPostsViews.displayName = "PostsViews";

replaceComponent('PostsViews', LWPostsViews);
