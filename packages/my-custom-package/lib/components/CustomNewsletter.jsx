/*
The original Newsletter components is defined using an 
ES6 class, so we use the "class foo extends bar" syntax
to extend it. This way, we can simply redefine the 
render method to change it, while preserving
all of the class's other methods (other render
functions, event handlers, etc.).
*/

import React, { PropTypes, Component } from 'react';

class CustomNewsletter extends Telescope.components.Newsletter {

  render() {

    const currentUser = this.context.currentUser;

    ({Icon} = Telescope.components);

    if (this.state.showBanner) {
      return (
        <div className="newsletter">
          <h4 className="newsletter-tagline">✉️{this.props.headerText}✉️</h4>
          {this.context.currentUser ? this.renderButton() : this.renderForm()}
          <a onClick={this.dismissBanner} className="newsletter-close"><Icon name="close"/></a>
        </div>
      );
    } else {
      return null;
    }
  }

}

export default CustomNewsletter;