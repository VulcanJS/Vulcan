// import Users from 'meteor/nova:users';
// import React from 'react';
// import { graphql } from 'react-apollo';
// import gql from 'graphql-tag';
// import hoistStatics from 'hoist-non-react-statics';
// import { Utils } from 'meteor/nova:lib';
// 
// const withApp = WrappedComponent => {
// 
//   class WithApp extends React.Component {
//     constructor(...args) {
//       super(...args);
//       
//       this.preloadedFields = ['_id'];
//     }
//     
//     componentWillMount() {
//       this.preloadedFields = _.compact(_.map(Users.simpleSchema()._schema, (field, fieldName) => {
//         return field.preload ? fieldName : undefined;
//       }));
//     }
//     
//     render() {
//       
//       const ComponentWithData = graphql(
//         gql`query getCurrentUser {
//           currentUser {
//             ${this.preloadedFields.join('\n')}
//           }
//         }
//         `, {
//           options(ownProps) {
//             return {
//               variables: {},
//               // pollInterval: 20000,
//             };
//           },
//           props(props) {
//             const {data: {loading, currentUser}} = props;
//             return {
//               loading,
//               currentUser,
//             };
//           },
//         }
//       )(WrappedComponent);
//       
//       return <ComponentWithData {...this.props} />
//     }
//   }
//   
//   WithApp.displayName = `withApp(${Utils.getComponentDisplayName(WrappedComponent)})`
//   WithApp.WrappedComponent = WrappedComponent
// 
//   return hoistStatics(WithApp, WrappedComponent);
// };
// 
// export default withApp;
