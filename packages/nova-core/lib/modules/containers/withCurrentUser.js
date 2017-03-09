import React, { Component } from 'react';
import { getFragment } from 'meteor/nova:lib';
import { graphql } from 'react-apollo';   
import gql from 'graphql-tag';    

const withCurrentUser = component => {

  return graphql(
    gql`
      query getCurrentUser {
        currentUser {
          ...UsersCurrent
        }
      }
      ${getFragment('UsersCurrent')}
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
