import { Components, replaceComponent} from 'meteor/vulcan:core';
import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';

const Layout = ({currentUser, children, currentRoute}) =>

  <div className={classNames('wrapper', `wrapper-${currentRoute.name.replace('.', '-')}`)} id="wrapper">

    {currentUser ? <Components.UsersProfileCheck currentUser={currentUser} documentId={currentUser._id} /> : null}

    <Components.Header {...this.props}/>

    <div className="main">

      <Components.FlashMessages />

      {children}

    </div>

    {/* <Components.Footer />  Deactivated Footer, since we don't use one. Might want to add one later*/ }

  </div>

Layout.displayName = "Layout";

replaceComponent('Layout', Layout);
