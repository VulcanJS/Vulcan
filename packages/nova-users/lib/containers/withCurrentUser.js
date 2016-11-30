import Telescope from 'meteor/nova:lib';
import Users from '../collection.js';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const withCurrentUser = component => {

  const preloadedFields = _.compact(_.map(Users.simpleSchema()._schema, (field, fieldName) => {
    return field.preload ? fieldName : undefined;
  }));
  
  // console.log('preloaded fields', preloadedFields);

  return graphql(
    gql`query getCurrentUser {
      currentUser {
        ${preloadedFields.join('\n')}
      }
    }
    `, {
      props(props) {
        const {data: {loading, currentUser}} = props;
        return {
          loading,
          currentUser,
        };
      },
    }
  )(component);
};

export default withCurrentUser;