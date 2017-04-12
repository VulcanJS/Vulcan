import React, { Component } from 'react';
import styles from './styles.css';

export default class MailchimpForm extends Component {

  render() {
    return (
      <div id="mc_embed_signup">
        <form
          action="//nikgraf.us6.list-manage.com/subscribe/post?u=26fff32ae6f0d587747d6953d&amp;id=c72cf53297"
          method="post"
          id="mc-embedded-subscribe-form"
          name="mc-embedded-subscribe-form"
          className="validate"
          noValidate
        >
          <div id="mc_embed_signup_scroll">
            <input
              type="email"
              defaultValue=""
              name="EMAIL"
              placeholder="Email"
              className={`required ${styles.email}`}
              id="mce-EMAIL"
            />
            <input
              type="text"
              defaultValue=""
              name="FNAME"
              className={`required ${styles.firstName}`}
              placeholder="First Name"
              id="mce-FNAME"
            />
            <div id="mce-responses" className="clear">
              <div className="response" id="mce-error-response" style={{ display: 'none' }} />
              <div className="response" id="mce-success-response" style={{ display: 'none' }} />
            </div>
            <div
              style={{ position: 'absolute', left: '-5000px' }}
              aria-hidden="true"
            >
              <input type="text" name="b_26fff32ae6f0d587747d6953d_c72cf53297" tabIndex="-1" value="" />
            </div>
            <div className="clear">
              <input type="submit" value="Subscribe" name="subscribe" id="mc-embedded-subscribe" className="button" />
            </div>
          </div>
        </form>
      </div>
    );
  }
}
