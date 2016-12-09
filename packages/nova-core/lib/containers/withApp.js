import Users from 'meteor/nova:users';
import Telescope from 'meteor/nova:lib';
import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import hoistStatics from 'hoist-non-react-statics';


const withApp = WrappedComponent => {

  class WithApp extends React.Component {
    constructor(...args) {
      super(...args);
      
      this.preloadedFields = ['_id'];
    }
    
    componentWillMount() {
      this.preloadedFields = _.compact(_.map(Users.simpleSchema()._schema, (field, fieldName) => {
        return field.preload ? fieldName : undefined;
      }));
    }
    
    render() {
      
      console.log(this.preloadedFields);
      
      const ComponentWithData = graphql(
        gql`query getCurrentUser {
          currentUser {
            ${this.preloadedFields.join('\n')}
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
      )(WrappedComponent);
      
      return <ComponentWithData {...this.props} />
    }
  }
  
  WithApp.displayName = `withApp(${Telescope.utils.getComponentDisplayName(WrappedComponent)})`
  WithApp.WrappedComponent = WrappedComponent

  return hoistStatics(WithApp, WrappedComponent);
};

export default withApp;
