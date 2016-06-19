/*
The original Newsletter components is defined using an 
ES6 class, so we use the "class foo extends bar" syntax
to extend it. This way, we can simply redefine the 
render method to change it, while preserving
all of the class's other methods (other render
functions, event handlers, etc.).
*/

import React, { PropTypes, Component } from 'react';
import { FormattedMessage, intlShape } from 'react-intl';

class CustomNewsletter extends Telescope.components.Newsletter {

  render() {

    return this.state.showBanner
      ? (
        <div className="newsletter">
          <h4 className="newsletter-tagline">✉️<FormattedMessage id="newsletter.subscribe_prompt"/>✉️</h4>
          {this.context.currentUser ? this.renderButton() : this.renderForm()}
          <a onClick={this.dismissBanner} className="newsletter-close"><Telescope.components.Icon name="close"/></a>
        </div>
      ) : null;
  }

}

export default CustomNewsletter;