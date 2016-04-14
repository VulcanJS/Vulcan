import React, { PropTypes, Component } from 'react';
import Router from "../router.js"
import Actions from "../actions.js"
import { Button, DropdownButton, MenuItem } from 'react-bootstrap';
import Core from "meteor/nova:core";
const Messages = Core.Messages;

class Category extends Component {

  constructor() {
    super();
    this.deleteCategory = this.deleteCategory.bind(this);
  }

  deleteCategory() {
    category = this.props.category;
    Actions.call("categories.deleteById", category._id, (error, result) => {
      if (error) {
        Messages.flash(error.message, "error");
      } else {
        Messages.flash(`Category “${category.name}” deleted and removed from ${result} posts.`, "success");
      }
    });
  }

  renderDelete() {
    const Icon = Telescope.components.Icon;
    return <a className="delete-category-link" onClick={this.deleteCategory}><Icon name="close"/></a>
  }

  render() {

    const {category, index, currentCategorySlug} = this.props;
    const Icon = Telescope.components.Icon;

    return (
      <div className="category-menu-item">
        <MenuItem 
          href={Router.extendPathWithQueryParams("posts.list", {}, {cat: category.slug})} 
          eventKey={index+1} 
          key={category._id} 
          className={currentCategorySlug === category.slug ? "post-category-active dropdown-item post-category" : "dropdown-item post-category"} 
        >
          {currentCategorySlug === category.slug ? <Icon name="voted"/> :  null}
          {category.name}
        </MenuItem>
        {Users.is.admin(this.context.currentUser) ? this.renderDelete() : null}
      </div>
    )
  }
}

Category.propTypes = {
  category: React.PropTypes.object,
  index: React.PropTypes.number,
  currentCategorySlug: React.PropTypes.string,
}

Category.contextTypes = {
  currentUser: React.PropTypes.object
};

class CategoriesList extends Component {
  render() {
    
    const categories = this.props.categories;
    const context = this.context;

    const currentRoute = context.currentRoute;
    const currentCategorySlug = currentRoute.queryParams.cat;
    
    if (categories && categories.length > 0) {
      return (
        <DropdownButton bsStyle="default" className="categories btn-secondary" title="Categories" id="categories-dropdown">
          <MenuItem href={Router.path("posts.list")} eventKey={0} className="dropdown-item post-category">All Categories</MenuItem>
          {categories.map((category, index) => <Category key={index} category={category} index={index} currentCategorySlug={currentCategorySlug}/>)}
        </DropdownButton>
      )
    } else {
      return null
    }
  }
};

CategoriesList.propTypes = {
  categories: React.PropTypes.array
}

CategoriesList.contextTypes = {
  currentRoute: React.PropTypes.object
};

module.exports = CategoriesList;