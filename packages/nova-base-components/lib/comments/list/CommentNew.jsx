import React, { PropTypes, Component } from 'react';
import Formsy from 'formsy-react';
import FRC from 'formsy-react-components';
import Actions from '../../actions.js';
import { Button } from 'react-bootstrap';

import Core from "meteor/nova:core";
const Messages = Core.Messages;

import ReactForms from "meteor/nova:forms";
const NewDocument = ReactForms.NewDocument;

const Textarea = FRC.Textarea;

class CommentNew extends Component {

  render() {

    let prefilledProps = {postId: this.props.postId};

    if (this.props.parentComment) {
      prefilledProps = Object.assign(prefilledProps, {
        parentCommentId: this.props.parentComment._id,
        // if parent comment has a topLevelCommentId use it; if it doesn't then it *is* the top level comment
        topLevelCommentId: this.props.parentComment.topLevelCommentId || this.props.parentComment._id
      });
    }

    return (
      <div className="comment-new-form">
        <NewDocument 
          collection={Comments} 
          currentUser={this.context.currentUser}
          methodName="comments.new"
          prefilledProps={prefilledProps}
          successCallback={(post)=>{
            this.props.successCallback();
            Messages.flash("Comment created.", "success");
          }}
          errorCallback={(post, error)=>{
            Messages.flash(error.message);
          }}
          labelFunction={(fieldName)=>Telescope.utils.getFieldLabel(fieldName, Comments)}
        />
        {this.props.type === "reply" ? <a className="comment-edit-cancel" onClick={this.props.cancelCallback}>Cancel</a> : null}
      </div>
    )
  }

};

CommentNew.propTypes = {
  postId: React.PropTypes.string.isRequired,
  successCallback: React.PropTypes.func, // a callback to execute when the submission has been successful
  type: React.PropTypes.string, // "comment" or "reply"
  parentComment: React.PropTypes.object, // if reply, the comment being replied to
  parentCommentId: React.PropTypes.string, // if reply
  topLevelCommentId: React.PropTypes.string, // if reply
  cancelCallback: React.PropTypes.func
}

CommentNew.contextTypes = {
  currentUser: React.PropTypes.object
}

module.exports = CommentNew;