import React, { PropTypes, Component } from 'react';
import Router from '../../router.js';
import { Button, ButtonGroup } from 'react-bootstrap';

const PostViews = (props, context) => {

  let views = ["top", "new", "best", "daily"];
  const adminViews = ["pending", "rejected", "scheduled"];
  
  if (Users.is.admin(Meteor.user())) {
    views = views.concat(adminViews);
  }

  const currentRoute = context.currentRoute;
  // console.log(currentRoute);
  
  return (
    <div className="post-views">
      <ButtonGroup>
        {views.map(view => <Button className={currentRoute.queryParams.view === view ? "post-view-active" : ""} bsStyle="default" key={view} href={Router.extendPathWithQueryParams("posts.list", {}, {view: view})}>{view}</Button>)}
      </ButtonGroup>
    </div>
  )
}

PostViews.contextTypes = {
  currentRoute: React.PropTypes.object
};

module.exports = PostViews;
