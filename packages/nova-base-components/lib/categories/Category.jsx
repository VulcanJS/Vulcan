import React, { PropTypes, Component } from 'react';
import Actions from "../actions.js"
import Router from "../router.js"
import { Button, DropdownButton, MenuItem } from 'react-bootstrap';
import classNames from "classnames";
import { Messages, ModalTrigger } from "meteor/nova:core";

class Category extends Component {

  renderEdit() {
    return <a onClick={this.props.openModal} className="edit-category-link"><Telescope.components.Icon name="edit"/></a>;
    // return (
    //   <ModalTrigger title="Edit Category" component={<a className="edit-category-link"><Telescope.components.Icon name="edit"/></a>}>
    //     <Telescope.componentsCategoriesEditForm category={this.props.category}/>
    //   </ModalTrigger>
    // )
  }

  render() {

    const {category, index, currentCategorySlug} = this.props;

    const categoryClass = classNames("category-menu-item", "dropdown-item", {"category-active": currentCategorySlug === category.slug});

    return (
      <div className={categoryClass}>
        <MenuItem 
          href={Router.extendPathWithQueryParams("posts.list", {}, {cat: category.slug})} 
          eventKey={index+1} 
          key={category._id} 
        >
          {currentCategorySlug === category.slug ? <Telescope.components.Icon name="voted"/> :  null}
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
  openModal: React.PropTypes.func
}

Category.contextTypes = {
  currentUser: React.PropTypes.object
};

module.exports = Category;
export default Category;