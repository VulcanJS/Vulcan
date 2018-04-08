// import React from 'react'
// import { loginWithFacebook, loginWithGoogle } from 'meteor/vulcan:accounts2'
// import { ApolloClient, Notification } from './index'
// import { browserHistory } from 'react-router'
// import FacebookLogin from 'react-facebook-login'
// import GoogleLogin from 'react-google-login'

// class SocialLogin extends React.Component {

//   async callbackFacebook({accessToken}) {
//     try {
//       let response = await loginWithFacebook({accessToken}, ApolloClient)
//       Notification.success(response)
//       ApolloClient.resetStore()
//       browserHistory.push('/')
//     } catch (error) {
//       Notification.error(error)
//     }
//   }

//   async successGoogle({accessToken}) {
//     try {
//       let response = await loginWithGoogle({accessToken}, ApolloClient)
//       Notification.success(response)
//       ApolloClient.resetStore()
//       browserHistory.push('/')
//     } catch (error) {
//       Notification.error(error)
//     }
//   }

//   failureGoogle(error) {
//     Notification.error(error)
//   }

//   render() {
//     return (
//       <div>
//         <FacebookLogin
//         appId='190860714704026'
//         fields='name,email,picture'
//         callback={this.callbackFacebook.bind(this)}
//         textButton='Facebook' />
//         <br />

//         <GoogleLogin
//         clientId='1054697330125-3sv92km5m5far4em9rirgscuimq4gs45.apps.googleusercontent.com'
//         buttonText='Google'
//         onSuccess={this.successGoogle.bind(this)}
//         onFailure={this.failureGoogle.bind(this)} />
//       </div>
//     )
//   }
// }

// export default SocialLogin
