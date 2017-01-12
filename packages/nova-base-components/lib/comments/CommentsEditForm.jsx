import { Components, registerComponent, getRawComponent } from 'meteor/nova:core';
import React, { PropTypes, Component } from 'react';
import SmartForm from "meteor/nova:forms";
import Comments from "meteor/nova:comments";
import { withMessages } from 'meteor/nova:core';

const CommentsEditForm = (props, context) => {
  return (
    <div className="comments-edit-form">
      <SmartForm 
        layout="elementOnly"
        collection={Comments}
        documentId={props.comment._id}
        successCallback={props.successCallback}
        cancelCallback={props.cancelCallback}
        removeSuccessCallback={props.removeSuccessCallback}
        showRemove={true}
        fragment={getRawComponent('PostsCommentsThread').fragment}
      />
    </div>
  )
}

CommentsEditForm.propTypes = {
  comment: React.PropTypes.object.isRequired,
  successCallback: React.PropTypes.func,
  cancelCallback: React.PropTypes.func
};

registerComponent('CommentsEditForm', CommentsEditForm, withMessages);