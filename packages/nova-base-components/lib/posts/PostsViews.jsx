import React, { PropTypes, Component } from 'react';
import Router from '../router.js';
import { Button, ButtonGroup, DropdownButton, MenuItem } from 'react-bootstrap';

const PostsViews = (props, context) => {

  let views = ["top", "new", "best"];
  const adminViews = ["pending", "rejected", "scheduled"];
  
  if (Users.is.admin(context.currentUser)) {
    views = views.concat(adminViews);
  }

  const currentRoute = context.currentRoute;
  const currentView = currentRoute.queryParams.view || props.defaultView;
  // console.log(currentRoute);
  
  return (
    <div className="posts-views">
      {/*
      <ButtonGroup>
        {views.map(view => <Button className={currentRoute.route.name === "posts.list" && currentView === view ? "post-view-active" : "post-view-inactive"} bsStyle="default" key={view} href={Router.extendPathWithQueryParams("posts.list", {}, {view: view})}>{Telescope.utils.capitalise(view)}</Button>)}
      </ButtonGroup>
      <Button bsStyle="default" href={Router.path("posts.daily")} className={currentRoute.route.name === "posts.daily" ? "post-view-active" : "post-view-inactive"} >Daily</Button>
      */}
      <DropdownButton 
        bsStyle="default" 
        className="views btn-secondary" 
        title="View" 
        id="views-dropdown"
      >
        {views.map(view => <MenuItem key={view} href={Router.extendPathWithQueryParams("posts.list", {}, {view: view})} className={currentRoute.route.name === "posts.list" && currentView === view ? "dropdown-item post-view-active" : "dropdown-item post-view-inactive"}>{Telescope.utils.capitalise(view)}</MenuItem>)}
        <MenuItem href={Router.path("posts.daily")} className={currentRoute.route.name === "posts.daily" ? "dropdown-item post-view-active" : "dropdown-item post-view-inactive"} >Daily</MenuItem>
      </DropdownButton>
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
  currentRoute: React.PropTypes.object,
  currentUser: React.PropTypes.object
};

PostsViews.displayName = "PostsViews";

module.exports = PostsViews;
