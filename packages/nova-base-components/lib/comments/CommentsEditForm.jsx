import React, { PropTypes, Component } from 'react';
import NovaForm from "meteor/nova:forms";
import Comments from "meteor/nova:comments";

const CommentsEditForm = (props, context) => {
  return (
    <div className="comments-edit-form">
      <NovaForm 
        layout="elementOnly"
        collection={Comments}
        document={props.comment}
        novaFormMutation={props.novaFormMutation}
        successCallback={props.successCallback}
        cancelCallback={props.cancelCallback}
      />
    </div>
  )
}

CommentsEditForm.propTypes = {
  comment: React.PropTypes.object.isRequired,
  successCallback: React.PropTypes.func,
  cancelCallback: React.PropTypes.func
}

CommentsEditForm.contextTypes = {
  currentUser: React.PropTypes.object
}

module.exports = CommentsEditForm;