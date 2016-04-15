import React, { PropTypes, Component } from 'react';
import Router from '../router.js';
import { Button, ButtonGroup } from 'react-bootstrap';

const PostsViews = (props, context) => {

  let views = ["top", "new", "best"];
  const adminViews = ["pending", "rejected", "scheduled"];
  
  if (Users.is.admin(Meteor.user())) {
    views = views.concat(adminViews);
  }

  const currentRoute = context.currentRoute;
  const currentView = currentRoute.queryParams.view || props.defaultView;
  // console.log(currentRoute);
  
  return (
    <div className="post-views">
      <ButtonGroup>
        {views.map(view => <Button className={currentRoute.route.name === "posts.list" && currentView === view ? "post-view-active" : "post-view-inactive"} bsStyle="default" key={view} href={Router.extendPathWithQueryParams("posts.list", {}, {view: view})}>{Telescope.utils.capitalise(view)}</Button>)}
      </ButtonGroup>
      <Button bsStyle="default" href={Router.path("posts.daily")} className={currentRoute.route.name === "posts.daily" ? "post-view-active" : "post-view-inactive"} >Daily</Button>
    </div>
  )
}

PostsViews.propTypes = {
  defaultView: React.PropTypes.string
}

PostsViews.defaultProps = {
  defaultView: "top"
}

PostsViews.contextTypes = {
  currentRoute: React.PropTypes.object
};

module.exports = PostsViews;
