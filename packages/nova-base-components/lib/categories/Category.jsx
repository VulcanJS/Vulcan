import React, { PropTypes, Component } from 'react';
import { Button, DropdownButton, MenuItem } from 'react-bootstrap';
import classNames from "classnames";
//import { Messages, ModalTrigger } from 'meteor/nova:core';
import { LinkContainer } from 'react-router-bootstrap';
import { withRouter } from 'react-router'
import Users from 'meteor/nova:users';

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

    const {category, index, router} = this.props;

    const currentQuery = router.location.query;
    const currentCategorySlug = router.location.query.cat;
    const newQuery = _.clone(router.location.query);
    newQuery.cat = category.slug;

    return (
      <div className="category-menu-item dropdown-item">
        <LinkContainer to={{pathname:"/", query: newQuery}} activeClassName="category-active">
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

module.exports = withRouter(Category);
export default withRouter(Category);