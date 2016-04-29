import React, { PropTypes, Component } from 'react';
import Actions from '../actions.js';
import NovaForm from "meteor/nova:forms";

class CommentsDelete extends Component {

  render() {
    return (
      <div className="comments-delete-form">
        <NovaForm
          collection={Comments}
          document={this.props.comment}
          currentUser={this.context.currentUser}
          methodName="comments.deleteById"
          submitButtonText="Delete"
          successCallback={this.props.successCallback}
          layout="elementOnly"
          cancelCallback={this.props.cancelCallback}
          fields={"null"}
        />
      </div>
    )
  }

}

CommentsDelete.propTypes = {
  comment: React.PropTypes.object.isRequired,
  successCallback: React.PropTypes.func,
  cancelCallback: React.PropTypes.func
}

CommentsDelete.contextTypes = {
  currentUser: React.PropTypes.object
}

module.exports = CommentsDelete;