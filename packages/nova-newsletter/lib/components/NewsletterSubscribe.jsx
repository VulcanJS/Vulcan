import React, { PropTypes, Component } from 'react';

const NewsletterSubscribe = (props, context) => {
  return (
    <div className="form-group row">
      <label className="control-label col-sm-3">Newsletter</label>
      <div className="col-sm-9">
        <Telescope.components.NewsletterButton user={props.document} successCallback={() => context.messages.flash("Newsletter subscription updated", "success")}/>
      </div>
    </div>
  )
}

NewsletterSubscribe.contextTypes = {
  messages: React.PropTypes.object,
};

module.exports = NewsletterSubscribe;
export default NewsletterSubscribe;