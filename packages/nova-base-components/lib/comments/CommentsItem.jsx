import React, { PropTypes, Component } from 'react';

class CommentsItem extends Component{

  constructor() {
    super();
    ['showReply',
     'replyCancelCallback',
     'replySuccessCallback',
     'showEdit',
     'showDelete',
     'editCancelCallback',
     'editSuccessCallback',
     'deleteCancelCallback',
     'deleteSuccessCallback'].forEach(methodName => {this[methodName] = this[methodName].bind(this)});
    this.state = {
      showReply: false,
      showEdit: false,
      showDelete: false
    };
  }

  showReply(event) {
    event.preventDefault();
    this.setState({showReply: true});
  }

  replyCancelCallback(event) {
    event.preventDefault();
    this.setState({showReply: false});
  }

  replySuccessCallback() {
    this.setState({showReply: false});
  }

  showEdit(event) {
    event.preventDefault();
    this.setState({showEdit: true});
  }

  showDelete(event) {
    event.preventDefault();
    this.setState({showDelete: true});
  }

  editCancelCallback(event) {
    event.preventDefault();
    this.setState({showEdit: false});
  }

  editSuccessCallback() {
    this.setState({showEdit: false});
  }

  deleteCancelCallback(event) {
    event.preventDefault();
    this.setState({showDelete: false});
  }

  deleteSuccessCallback() {
    this.setState({showDelete: false});
  }

  renderComment() {
    const htmlBody = {__html: this.props.comment.htmlBody};

    return (
      <div className="comments-item-text">
        <div dangerouslySetInnerHTML={htmlBody}></div>
        {!this.props.comment.isDeleted ? <a className="comments-item-reply-link" onClick={this.showReply}><Icon name="reply"/> Reply</a> : null}
      </div>
    )
  }

  renderReply() {

    ({CommentsNew} = Telescope.components);

    return (
      <div className="comments-item-reply">
        <CommentsNew
          postId={this.props.comment.postId}
          parentComment={this.props.comment}
          successCallback={this.replySuccessCallback}
          cancelCallback={this.replyCancelCallback}
          type="reply"
        />
      </div>
    )
  }

  renderEdit() {

    ({CommentsEdit} = Telescope.components);

    return (
      <CommentsEdit
        comment={this.props.comment}
        successCallback={this.editSuccessCallback}
        cancelCallback={this.editCancelCallback}
      />
    )
  }

  renderDelete() {
    ({CommentsDelete} = Telescope.components);

    return (
      <CommentsDelete
        comment={this.props.comment}
        successCallback={this.deleteSuccessCallback}
        cancelCallback={this.deleteCancelCallback}
      />
    )
  }

  render() {

    ({UsersAvatar} = Telescope.components);

    const comment = this.props.comment;

    return (
      <div className="comments-item" id={comment._id}>
        <div className="comments-item-body">
          <div className="comments-item-meta">
            <UsersAvatar size="small" user={comment.user}/>
            <UsersName user={comment.user}/>
            <div className="comments-item-date">{moment(comment.postedAt).fromNow()}</div>
            {Users.can.edit(this.props.currentUser, this.props.comment) ? <a className="comment-edit" onClick={this.showEdit}>Edit</a> : null}
            {Users.can.edit(this.props.currentUser, this.props.comment) ? <a className="comment-delete" onClick={this.showDelete}>Delete</a> : null}
          </div>
          {this.state.showEdit ? this.renderEdit() : this.renderComment()}
          {this.state.showDelete ? this.renderDelete() : null}
        </div>
        {this.state.showReply ? this.renderReply() : null}
      </div>
    )
  }

}

CommentsItem.propTypes = {
  comment: React.PropTypes.object.isRequired, // the current comment
  currentUser: React.PropTypes.object, // the current user
}

module.exports = CommentsItem;