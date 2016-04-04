import React, { PropTypes, Component } from 'react';
import Actions from '../../actions.js';
import NovaForm from "meteor/nova:forms";

class CommentEdit extends Component {

  render() {
    return (
      <div className="comment-edit">
        <NovaForm 
          collection={Comments}
          document={this.props.comment}
          currentUser={this.context.currentUser}
          methodName="comments.edit"
          successCallback={this.props.successCallback}
        />
        <a className="comment-edit-cancel" onClick={this.props.cancelCallback}>Cancel</a>
      </div>
    )
  }

}

CommentEdit.propTypes = {
  comment: React.PropTypes.object.isRequired,
  successCallback: React.PropTypes.func,
  cancelCallback: React.PropTypes.func
}

CommentEdit.contextTypes = {
  currentUser: React.PropTypes.object
}

module.exports = CommentEdit;