// import React from 'react';
// import { graphql } from 'react-apollo';
// import gql from 'graphql-tag';
// import Users from 'meteor/nova:users';

// export default function withApp(component, options) {
//   return graphql(gql`
//     query getCurrentUser {
//       currentUser {
//         ...fullUserInfo
//       }
//     }
//     ${Users.fragments.full}
//   `, {
//     options(ownProps) {
//       return {
//         variables: {},
//         pollInterval: 20000,
//       };
//     },
//     props(props) {
//       const {data: {loading, currentUser}} = props;
//       return {
//         loading,
//         currentUser,
//       };
//     },
//   })(component)
// };

// module.exports = withApp;