import { ModalTrigger, Components, registerComponent } from 'meteor/vulcan:core';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { LinkContainer } from 'react-router-bootstrap';
import MenuItem from 'react-bootstrap/lib/MenuItem'
import { withRouter } from 'react-router'
import Categories from 'meteor/vulcan:categories';

class Category extends PureComponent {

  renderEdit() {
    return (
      <ModalTrigger title="Edit Category" component={<a className="edit-category-link"><Components.Icon name="edit"/></a>}>
        <Components.CategoriesEditForm category={this.props.category}/>
      </ModalTrigger>
    )
  }

  render() {

    const {category, index, router} = this.props;

    // const currentQuery = router.location.query;
    const currentCategorySlug = router.location.query.cat;
    const newQuery = _.clone(router.location.query);
    newQuery.cat = category.slug;

    return (
      <div className="category-menu-item dropdown-item">
        <LinkContainer to={{pathname:"/", query: newQuery}}>
          <MenuItem
            eventKey={index+1}
            key={category._id}
          >
            {currentCategorySlug === category.slug ? <Components.Icon name="voted"/> :  null}
            {category.name}
          </MenuItem>
        </LinkContainer>
        <Components.ShowIf check={Categories.options.mutations.edit.check} document={category}>{this.renderEdit()}</Components.ShowIf>
      </div>
    )
  }
}

Category.propTypes = {
  category: PropTypes.object,
  index: PropTypes.number,
  currentCategorySlug: PropTypes.string,
  openModal: PropTypes.func
};

registerComponent('Category', Category, withRouter);
