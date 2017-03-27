import { registerComponent, withCurrentUser } from 'meteor/vulcan:core';
import React, { PropTypes, Component } from 'react';
import { FormattedMessage, intlShape } from 'react-intl';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { withRouter } from 'react-router'
import Users from 'meteor/vulcan:users';

const PostsViews = (props, context) => {

  let views = ["top", "new", "best"];
  const adminViews = ["pending", "rejected", "scheduled"];

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
          <LinkContainer key={view} to={{pathname: "/", query: {...query, view: view}}} className="dropdown-item">
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

PostsViews.propTypes = {
  currentUser: React.PropTypes.object,
  defaultView: React.PropTypes.string
};

PostsViews.defaultProps = {
  defaultView: "top"
};

PostsViews.contextTypes = {
  currentRoute: React.PropTypes.object,
  intl: intlShape
};

PostsViews.displayName = "PostsViews";

registerComponent('PostsViews', PostsViews, withCurrentUser, withRouter);
