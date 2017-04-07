/* 

The Layout component. 

In other words, the template used to display every page in the app. 
Specific pages will be displayed in place of the "children" property. 

Note: the Helmet library is used to insert meta tags and link tags in the <head>

*/

import React, { PropTypes, Component } from 'react';
import Helmet from 'react-helmet';
import Header from './Header.jsx';

const links = [
  // note: modal popups won't work with anything above alpha.5. 
  // see https://github.com/twbs/bootstrap/issues/21876#issuecomment-276181539
  {
    rel: 'stylesheet',
    type: 'text/css',
    href: 'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.5/css/bootstrap.min.css'
  },
  {
    rel: 'stylesheet',
    type: 'text/css',
    href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css'
  }
];

const Layout = ({children}) =>

  <div className="wrapper" id="wrapper">

    <Helmet title="Vulcanstagram" link={links} />
    
    <link  />
    
    <Header/>
  
    <div className="main">

      {children}

    </div>
  
    <div className="footer">&copy; Vulcanstagram</div>

  </div>

export default Layout;