import React, { PropTypes, Component } from 'react';
import { Button, DropdownButton, MenuItem } from 'react-bootstrap';
import Router from "../router.js"
import Core from "meteor/nova:core";
const ModalTrigger = Core.ModalTrigger;

class CategoriesList extends Component {

  renderNew() {
    const CategoriesNewForm = Telescope.components.CategoriesNewForm;
    return (
      <ModalTrigger title="New Category" component={<MenuItem className="dropdown-item post-category"><Button bsStyle="primary">New Category</Button></MenuItem>}>
        <CategoriesNewForm/>
      </ModalTrigger>
    )
  }

  render() {
    
    const Category = Telescope.components.Category;

    const categories = this.props.categories;
    const context = this.context;

    const currentRoute = context.currentRoute;
    const currentCategorySlug = currentRoute.queryParams.cat;
    
    return (
      <DropdownButton 
        bsStyle="default" 
        className="categories btn-secondary" 
        title="Categories" 
        id="categories-dropdown"
      >
        <MenuItem href={Router.path("posts.list")} eventKey={0} className="dropdown-item post-category">All Categories</MenuItem>
        {categories && categories.length > 0 ? categories.map((category, index) => <Category key={index} category={category} index={index} currentCategorySlug={currentCategorySlug}/>) : null}
        {Users.is.admin(this.context.currentUser) ? this.renderNew() : null}
      </DropdownButton>
    )

  }
};

CategoriesList.propTypes = {
  categories: React.PropTypes.array
}

CategoriesList.contextTypes = {
  currentUser: React.PropTypes.object,
  currentRoute: React.PropTypes.object
};

module.exports = CategoriesList;
export default CategoriesList;