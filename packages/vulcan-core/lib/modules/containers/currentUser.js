import React from 'react';
import { getFragment } from 'meteor/vulcan:lib';
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import get from 'lodash/get';

// NOTE: this needs to be a function to avoid fragment registration issue at build time
export const buildCurrentUserQuery = () => gql`
  query getCurrentUser {
    currentUser {
      ...UsersCurrent
    }
  }
  ${getFragment('UsersCurrent')}
`;

export const useCurrentUser = () => {
  const result = useQuery(buildCurrentUserQuery());
  return {
    ...result,
    currentUser: get(result, 'data.currentUser'),
  };
};

export const withCurrentUser = C => {
  const Wrapped = props => {
    const res = useCurrentUser();
    const { loading, data, refetch } = res;
    const namedRes = {
      currentUserLoading: loading,
      currentUser: data && data.currentUser,
      currentUserData: data,
      currentUserRefetch: refetch,
    };
    return <C {...props} {...namedRes} />;
  };
  Wrapped.displayName = 'withCurrentUser';
  return Wrapped;
};

// legacy export
export default withCurrentUser;

// previous implementation
/*
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
        const { data } = props;
        return {
          currentUserLoading: data.loading,
          currentUser: data.currentUser,
          currentUserData: data,
        };
      },
    }
  )(component);
};

export default withCurrentUser;
*/
