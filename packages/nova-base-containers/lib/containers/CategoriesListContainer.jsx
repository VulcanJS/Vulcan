// import Telescope from 'meteor/nova:lib';
// import React, { PropTypes, Component } from 'react';
// import Categories from "meteor/nova:categories";

// import { graphql } from 'react-apollo';
// import gql from 'graphql-tag';

// class CategoriesListContainer extends Component {
  
//   render() {

//     const {loading, results, componentProps} = this.props;
//     const Component = this.props.component;

//     return <Component results={results || []} loading={loading} {...componentProps}
//       />;
//   }
// };

// CategoriesListContainer.propTypes = {
//   loading: React.PropTypes.bool,
//   results: React.PropTypes.array,
// };

// CategoriesListContainer.displayName = "CategoriesListContainer";

// const CategoriesListContainerWithData = graphql(gql`
//   query getCategoriesList {
//     categories {
//       _id
//       name
//       description
//       order
//       slug
//       image
//     }
//   }
// `, {
//   options(ownProps) {
//     return {
//       variables: {},
//       // pollInterval: 20000,
//     };
//   },
//   props(props) {
//     const {data: {loading, categories}} = props;
//     return {
//       loading,
//       results: categories,
//     };
//   },
// })(CategoriesListContainer);

// module.exports = CategoriesListContainerWithData;