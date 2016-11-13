import Telescope from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import { graphql } from 'react-apollo';
import Categories from 'meteor/nova:categories'
import gql from 'graphql-tag';

export default function withCategoriesList(component, options) {
  return graphql(gql`
    query getCategoriesList {
      categoriesListTotal
      categories {
        ...fullCategoryInfo
        parent {
          ...fullCategoryInfo
        }
      }
    }
  `, {
    options(ownProps) {
      return {
        variables: {},
        fragments: Categories.fragments.full,
        // pollInterval: 20000,
      };
    },
    props(props) {
      const {data: {loading, categories}} = props;
      return {
        loading,
        results: categories,
      };
    }
  })(component);
}

module.exports = withCategoriesList;