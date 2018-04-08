// import React from 'react'
// import { createUser } from 'meteor-apollo-accounts'
// import { ApolloClient, Notification } from './index'
// import { graphql } from 'react-apollo';
// import gql from 'graphql-tag';

// class Profile extends React.Component {

//   update(event) {
//     event.preventDefault();

//     let { updateProfile } = this.props
//     let { firstname, lastname } = this.refs
//     firstname = firstname.value
//     lastname = lastname.value

//     updateProfile({firstname: firstname, lastname: lastname})
//     .then((response) => {
//       Notification.success(response)
//       ApolloClient.resetStore()
//     }).catch((error) => {
//       Notification.error(error)
//     });
//   }

//   render() {
//     let { me, loading } = this.props.data

//     return (loading || !me) ? (<p>Loading...</p>) : (
//       <div>
//           <form onSubmit={this.update.bind(this)}>
//               <label>Firstname: </label>
//               <input
//               defaultValue={me.profile.firstname}
//               type="text"
//               required="true"
//               ref="firstname" />
//               <br />

//               <label>Lastname: </label>
//               <input
//               defaultValue={me.profile.lastname}
//               type="text"
//               required="true"
//               ref="lastname" />
//               <br />

//               <button type="submit">Save</button>
//           </form>
//       </div>
//     );
//   }
// }

// const query = gql`
// query getCurrentUser {
//   me {
//     profile {
//       firstname
//       lastname
//     }
//   }
// }
// `

// const updateProfile = gql`
// mutation updateProfile($firstname: String, $lastname: String, $name: String) {
//   updateProfile(firstname: $firstname, lastname: $lastname, name: $name){
//     success
//   }
// }
// `

// Profile = graphql(updateProfile, {
//   props({ mutate }) {
//     return {
//       updateProfile({firstname, lastname}) {
//         let name = `${firstname} ${lastname}`
//         return mutate({ variables: { firstname, lastname, name }})
//       }
//     }
//   },
// })(graphql(query)(Profile))

// export default Profile
