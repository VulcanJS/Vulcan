import React, { PropTypes, Component } from 'react';

class CommentsItem extends Component{

  constructor() {
    super();
    ['showReply', 'replyCancelCallback', 'replySuccessCallback', 'showEdit', 'editCancelCallback', 'editSuccessCallback', 'deleteComment'].forEach(methodName => {this[methodName] = this[methodName].bind(this)});
    this.state = {
      showReply: false,
      showEdit: false
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
  
  editCancelCallback(event) {
    event.preventDefault();
    this.setState({showEdit: false});
  }

  editSuccessCallback() {
    this.setState({showEdit: false});
  }

  deleteComment() {
    const comment = this.props.comment;
    if (window.confirm(`Delete comment “${comment.body}”?`)) {
      Meteor.call('comments.deleteById', comment._id, (error, result) => {
       Messages.flash(`Comment “${comment.body}” deleted.`, "success");
       Events.track("comment deleted", {'_id': comment._id});
      });
    }
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

    ({CommentsEdit}  = Telescope.components);
    
    return (
      <CommentsEdit 
        comment={this.props.comment} 
        successCallback={this.editSuccessCallback} 
        cancelCallback={this.editCancelCallback}
      />
    )
  }

  render() {
    
    ({UsersAvatar}  = Telescope.components);

    const comment = this.props.comment;

    return (
      <div className="comments-item" id={comment._id}>
        <div className="comments-item-body">
          <div className="comments-item-meta">
            <UsersAvatar size="small" user={comment.user}/>
            <UsersName user={comment.user}/>
            <div className="comments-item-date">{moment(comment.postedAt).fromNow()}</div>
            {Users.can.edit(this.props.currentUser, this.props.comment) ? <a className="comment-edit" onClick={this.showEdit}>Edit</a> : null}
            {Users.can.edit(this.props.currentUser, this.props.comment) ? <a className="comment-delete" onClick={this.deleteComment}>Delete</a> : null}
          </div>
          {this.state.showEdit ? this.renderEdit() : this.renderComment()}
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
