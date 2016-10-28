import Telescope from 'meteor/nova:lib';
import React from 'react';
import Posts from "meteor/nova:posts";

import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const AppContainer = (props, context) => {

  const {loading, refetch} = props.data;

  return <Telescope.components.App
    ready={!loading}
    refetchQuery={refetch}
    {...props}
  />;
};

AppContainer.propTypes = {
  data: React.PropTypes.shape({
    loading: React.PropTypes.bool,
    post: React.PropTypes.object,
  }).isRequired,
  params: React.PropTypes.object
};

AppContainer.contextTypes = {
  currentUser: React.PropTypes.object
};

AppContainer.displayName = "AppContainer";

const AppContainerWithData = graphql(gql`
  query getAppData {
    categories {
      _id
      name
      description
      order
      slug
      image
    }
  }
`, {
  options(ownProps) {
    return {
      variables: {},
      pollInterval: 20000,
    };
  },
})(AppContainer);

module.exports = AppContainerWithData;