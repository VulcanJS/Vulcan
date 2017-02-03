import { Components, registerComponent } from 'meteor/nova:core';
import React, { PropTypes, Component } from 'react';

class Layout extends Component {

  render() {
    return (
      <div className="wrapper" id="wrapper">

        <Components.HeadTags />

        <Components.UsersProfileCheck {...this.props} />

        <Components.Header {...this.props}/>
      
        <div className="main">

          <Components.FlashMessages />

          <Components.Newsletter />

          {this.props.children}

        </div>
      
        <Components.Footer {...this.props}/>
      
      </div>
    )
  }
}

Layout.displayName = "Layout";

registerComponent('Layout', Layout);