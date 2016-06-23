import React, { PropTypes, Component } from 'react';
import NovaForm from "meteor/nova:forms";
import Comments from "meteor/nova:comments";

class CommentsEdit extends Component {

  render() {
    return (
      <div className="comments-edit-form">
        <NovaForm 
          collection={Comments}
          document={this.props.comment}
          currentUser={this.context.currentUser}
          methodName="comments.edit"
          successCallback={this.props.successCallback}
          layout="elementOnly"
          cancelCallback={this.props.cancelCallback}
        />
      </div>
    )
  }

}

CommentsEdit.propTypes = {
  comment: React.PropTypes.object.isRequired,
  successCallback: React.PropTypes.func,
  cancelCallback: React.PropTypes.func
}

CommentsEdit.contextTypes = {
  currentUser: React.PropTypes.object
}

module.exports = CommentsEdit;