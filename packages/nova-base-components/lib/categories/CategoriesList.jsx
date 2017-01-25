import { ModalTrigger, Components, registerComponent, ShowIf, withList, Utils } from "meteor/nova:core";
import React, { PropTypes, Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, DropdownButton, MenuItem, Modal } from 'react-bootstrap';
import { withRouter } from 'react-router'
import { LinkContainer } from 'react-router-bootstrap';
import Categories from 'meteor/nova:categories';
import gql from 'graphql-tag';

class CategoriesList extends Component {

  render() {

    const categories = this.props.results;

    const currentQuery = _.clone(this.props.router.location.query);
    delete currentQuery.cat;

    const categoriesClone = _.map(categories, _.clone); // we don't want to modify the objects we got from props
    const nestedCategories = Utils.unflatten(categoriesClone, '_id', 'parentId');

    return (
      <div>
        <DropdownButton
          bsStyle="default"
          className="categories-list btn-secondary"
          title={<FormattedMessage id="categories"/>}
          id="categories-dropdown"
        >
          <div className="category-menu-item dropdown-item">
            <LinkContainer to={{pathname:"/", query: currentQuery}}>
              <MenuItem eventKey={0}>
                <FormattedMessage id="categories.all"/>
              </MenuItem>
            </LinkContainer>
          </div>
          {
            // categories data are loaded
            !this.props.loading ?
              // there are currently categories
              nestedCategories && nestedCategories.length > 0 ?
                nestedCategories.map((category, index) => <Components.CategoriesNode key={index} category={category} index={index} openModal={this.openCategoryEditModal}/>)
              // not any category found
              : null
            // categories are loading
            : <div className="dropdown-item"><MenuItem><Components.Loading /></MenuItem></div>
          }
          <Components.ShowIf check={Categories.options.mutations.new.check}>
            <div className="categories-new-button category-menu-item dropdown-item">
              <ModalTrigger title={<FormattedMessage id="categories.new"/>} component={<Button bsStyle="primary"><FormattedMessage id="categories.new"/></Button>}>
                <Components.CategoriesNewForm/>
              </ModalTrigger>
            </div>
          </Components.ShowIf>
        </DropdownButton>

      </div>
    )

  }
}

CategoriesList.propTypes = {
  results: React.PropTypes.array,
};

CategoriesList.fragment = gql`
  fragment categoriesListFragment on Category {
    _id
    name
    description
    order
    slug
    image
    parentId
    parent {
      _id
    }
  }
`;

const categoriesListOptions = {
  collection: Categories,
  queryName: 'categoriesListQuery',
  fragment: CategoriesList.fragment,
  limit: 0,
  pollInterval: 0,
};

registerComponent('CategoriesList', CategoriesList, withRouter, withList(categoriesListOptions));
