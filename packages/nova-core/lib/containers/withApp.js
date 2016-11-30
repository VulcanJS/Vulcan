import Users from 'meteor/nova:users';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const withApp = component => {

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
      options(ownProps) {
        return {
          variables: {},
          pollInterval: 20000,
        };
      },
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

export default withApp;
