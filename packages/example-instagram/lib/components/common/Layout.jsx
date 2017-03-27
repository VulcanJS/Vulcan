import React, { PropTypes, Component } from 'react';
import Header from './Header.jsx';

const Layout = ({children}) =>

  <div className="wrapper" id="wrapper">

    <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
    
    <Header/>
  
    <div className="main">

      {children}

    </div>
  
    <div className="footer">&copy; Vulcanstagram</div>

  </div>

export default Layout;