import React, { PropTypes, Component } from 'react';
import Actions from "../actions.js"
import Router from "../router.js"
import { Button, DropdownButton, MenuItem } from 'react-bootstrap';
import Core from "meteor/nova:core";
const Messages = Core.Messages;
const ModalTrigger = Core.ModalTrigger;

class Category extends Component {

  renderEdit() {
    const {Icon, CategoriesEditForm} = Telescope.components;
    return (
      <ModalTrigger title="Edit Category" component={<a className="edit-category-link"><Icon name="edit"/></a>}>
        <CategoriesEditForm category={this.props.category}/>
      </ModalTrigger>
    )
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
        {Users.is.admin(this.context.currentUser) ? this.renderEdit() : null}
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

module.exports = Category;
export default Category;