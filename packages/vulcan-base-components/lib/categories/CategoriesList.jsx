import { ModalTrigger, Components, registerComponent, withList, Utils } from "meteor/vulcan:core";
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'meteor/vulcan:i18n';
import Button from 'react-bootstrap/lib/Button';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import { withRouter } from 'react-router'
import { LinkContainer } from 'react-router-bootstrap';
import Categories from 'meteor/vulcan:categories';
import { withApollo } from 'react-apollo';

class CategoriesList extends PureComponent {

  constructor() {
    super();
    this.getCurrentCategoriesArray = this.getCurrentCategoriesArray.bind(this);
    this.getCategoryLink = this.getCategoryLink.bind(this);
  }

  getCurrentCategoriesArray() {
    const currentCategories = _.clone(this.props.location.query.cat);
    if (currentCategories) {
      return Array.isArray(currentCategories) ? currentCategories : [currentCategories]
    } else {
      return [];
    }
  }

  getCategoryLink(slug) {
    const categories = this.getCurrentCategoriesArray();
    return {
      pathname: '/',
      query: {
        ...this.props.location.query,
        cat: categories.includes(slug) ? _.without(categories, slug) : categories.concat([slug])
      }
    }
  }

  getNestedCategories() {
    const categories = this.props.results;

    // check if a category is currently active in the route
    const currentCategorySlug = this.props.router.location.query && this.props.router.location.query.cat;
    const currentCategory = Categories.findOneInStore(this.props.client.store, {slug: currentCategorySlug});
    const parentCategories = Categories.getParents(currentCategory, this.props.client.store);

    // decorate categories with active and expanded properties
    const categoriesClone = _.map(categories, category => {
      return {
        ...category, // we don't want to modify the objects we got from props
        active: currentCategory && category.slug === currentCategory.slug, 
        expanded: parentCategories && _.contains(_.pluck(parentCategories, 'slug'), category.slug)
      };
    }); 

    const nestedCategories = Utils.unflatten(categoriesClone, {idProperty: '_id', parentIdProperty: 'parentId'});

    return nestedCategories;
  }

  render() {

    const allCategoriesQuery = _.clone(this.props.router.location.query);
    delete allCategoriesQuery.cat;
    const nestedCategories = this.getNestedCategories();

    return (
      <div>
        <DropdownButton
          bsStyle="default"
          className="categories-list btn-secondary"
          title={<FormattedMessage id="categories"/>}
          id="categories-dropdown"
        >
          <div className="category-menu-item category-menu-item-all dropdown-item">
            <LinkContainer className="category-menu-item-title" to={{pathname:"/", query: allCategoriesQuery}}>
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
  results: PropTypes.array,
};


const options = {
  collection: Categories,
  queryName: 'categoriesListQuery',
  fragmentName: 'CategoriesList',
  limit: 0,
  pollInterval: 0,
};

registerComponent('CategoriesList', CategoriesList, withRouter, withApollo, [withList, options]);
