import React, { PropTypes, Component } from 'react';
import Actions from "../actions.js"
import { Button, DropdownButton, MenuItem } from 'react-bootstrap';
import classNames from "classnames";
import { Messages, ModalTrigger } from 'meteor/nova:core';
import { LinkContainer } from 'react-router-bootstrap';

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

    return (
      <div className="category-menu-item dropdown-item">
        <LinkContainer to={{pathname:"/", query: {cat: category.slug}}} activeClassName="category-active">
          <MenuItem 
            eventKey={index+1} 
            key={category._id} 
          >
            {currentCategorySlug === category.slug ? <Telescope.components.Icon name="voted"/> :  null}
            {category.name}
          </MenuItem>
        </LinkContainer>
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