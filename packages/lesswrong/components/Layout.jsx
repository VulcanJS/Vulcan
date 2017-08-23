import { Components, replaceComponent} from 'meteor/vulcan:core';
// import { InstantSearch} from 'react-instantsearch/dom';
import React, { PropTypes, Component } from 'react';
import Helmet from 'react-helmet';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import Intercom, { IntercomAPI } from 'react-intercom';

const muiTheme = getMuiTheme({
  "fontFamily": "ETBook",
  "palette": {
    "primary1Color": "#f5f5f5",
    "accent1Color": "#43a047",
    "primary2Color": "#eeeeee",
    "accent2Color": "#81c784",
    "accent3Color": "#c8e6c9",
    "pickerHeaderColor": "#4caf50"
  },
  "appBar": {
    "textColor": "rgba(0, 0, 0, 0.54)"
  },
  "datePicker": {
    "color": "rgba(0,0,0,0.54)",
    "selectTextColor": "rgba(0,0,0,0.54)",
  },
  "flatButton": {
    "primaryTextColor": "rgba(0,0,0,0.54)"
  },
  userAgent: 'all',
});

const Layout = ({currentUser, children, currentRoute}) =>

  <div className="wrapper" id="wrapper">
    <MuiThemeProvider muiTheme={muiTheme}>
      <div>
        <Helmet>
          <title>LessWrong 2.0</title>
          <link name="bootstrap" rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.5/css/bootstrap.min.css"/>
          <link name="font-awesome" rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"/>
          <link name="material-icons" rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/icon?family=Material+Icons"/>
          <link name="react-instantsearch" rel="stylesheet" type="text/css" href="https://unpkg.com/react-instantsearch-theme-algolia@4.0.0/style.min.css"/>
          <meta httpEquiv="Accept-CH" content="DPR, Viewport-Width, Width"/>
          <script src="//widget.cloudinary.com/global/all.js" type="text/javascript"/>

          {/* <link name="cardo-font" rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/css?family=Cardo:400,400i,700" />*/}
        </Helmet>

        {currentUser ? <Components.UsersProfileCheck currentUser={currentUser} documentId={currentUser._id} /> : null}

        {/* Sign up user for Intercom, if they do not yet have an account */}

        {currentUser ? <Intercom appID="wtb8z7sj"
            user_id={currentUser._id} email={currentUser.email} name={currentUser.displayName}
        /> : null}

        {currentUser ? IntercomAPI('update', { "name" : currentUser.displayName, "email" : currentUser.email, "user_id" : currentUser._id, "createdAt" : currentUser.createdAt }) : null}

        <Components.Header {...this.props}/>

        <div className="main">

          <Components.FlashMessages />

          {children}

        </div>

        {/* <Components.Footer />  Deactivated Footer, since we don't use one. Might want to add one later*/ }
      </div>
    </ MuiThemeProvider>
  </div>

Layout.displayName = "Layout";

replaceComponent('Layout', Layout);
