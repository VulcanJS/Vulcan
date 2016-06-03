import React, { PropTypes, Component } from 'react';
import { Messages } from 'meteor/nova:core';

const NewsletterSubscribe = ({props}) => {
  return (
    <div className="form-group row">
      <label className="control-label col-sm-3">Newsletter</label>
      <div className="col-sm-9">
        <Telescope.components.NewsletterButton successCallback={() => Messages.flash("Newsletter subscription updated", "success")}/>
      </div>
    </div>
  )
}

module.exports = NewsletterSubscribe;
export default NewsletterSubscribe;