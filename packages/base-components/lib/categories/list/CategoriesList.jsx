import React, { PropTypes, Component } from 'react';
import Router from "../../router.js"
import { DropdownButton, MenuItem } from 'react-bootstrap';

const CategoriesList = ({categories}, context) => {

  const currentRoute = context.currentRoute;
  const currentCategory = currentRoute.queryParams.cat;
  
  if (categories && categories.length > 0) {
    return (
      <div className="categories">
        <DropdownButton bsStyle="default" className="btn-secondary" title="Categories" id="categories-dropdown">
          <MenuItem href={Router.path("posts.list")} eventKey={0} className="dropdown-item post-category">All Categories</MenuItem>
          {categories.map((category, index) => 
            <MenuItem 
              href={Router.extendPathWithQueryParams("posts.list", {}, {cat: category.slug})} 
              eventKey={index+1} 
              key={category._id} 
              className={currentCategory === category.slug ? "post-category-active dropdown-item post-category" : "dropdown-item post-category"} 
            >
              {currentCategory === category.slug ? <Icon name="voted"/> :  null}
              {category.name}
            </MenuItem>
          )}
        </DropdownButton>
      </div>
    )
  } else {
    return null
  }
  
};


CategoriesList.contextTypes = {
  currentRoute: React.PropTypes.object
};

module.exports = CategoriesList;