import React, { Component } from 'react';
import { graphql } from 'react-apollo';   
import gql from 'graphql-tag';    
import Users from 'meteor/nova:users';   

const withCurrentUser = component => {

  const preloadedFields = Users.getPreloadedFields();

  return graphql(gql`
    query getCurrentUser {
      currentUser {
        ${preloadedFields.join('\n')}
      }
    }
    `, {
      alias: 'withCurrentUser',
      
      props(props) {
        const {data: {loading, currentUser}} = props;
        return {
          loading,
          currentUser,
        };
      },
    }
  )(component);
}

export default withCurrentUser;
