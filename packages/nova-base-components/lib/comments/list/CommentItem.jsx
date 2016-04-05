import React, { PropTypes, Component } from 'react';

class CommentItem extends Component{

  constructor() {
    super();
    ['showReply', 'replyCancelCallback', 'replySuccessCallback', 'showEdit', 'editCancelCallback', 'editSuccessCallback'].forEach(methodName => {this[methodName] = this[methodName].bind(this)});
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

  renderComment() {
    const htmlBody = {__html: this.props.comment.htmlBody};

    return (
      <div className="comment-text">
        <div dangerouslySetInnerHTML={htmlBody}></div>
        <a className="comment-reply-link" onClick={this.showReply}><Icon name="reply"/> Reply</a>
      </div>  
    )
  }

  renderReply() {
    
    ({CommentNew} = Telescope.components);

    return (
      <div className="comment-reply">
        <CommentNew 
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

    ({CommentEdit}  = Telescope.components);
    
    return (
      <CommentEdit 
        comment={this.props.comment} 
        successCallback={this.editSuccessCallback} 
        cancelCallback={this.editCancelCallback}
      />
    )
  }

  render() {
    
    ({UserAvatar}  = Telescope.components);

    const comment = this.props.comment;

    return (
      <div className="comment-item" id={comment._id}>
        <div className="comment-body">
          <div className="comment-meta">
            <UserAvatar size="small" user={comment.user}/>
            <UserName user={comment.user}/>
            <div className="comment-date">{moment(comment.postedAt).fromNow()}</div>
            {Users.can.edit(this.props.currentUser, this.props.comment) ? <a className="comment-edit" onClick={this.showEdit}>Edit</a> : null}
          </div>
          {this.state.showEdit ? this.renderEdit() : this.renderComment()}
        </div>
        {this.state.showReply ? this.renderReply() : null}
      </div>
    )
  }

}

CommentItem.propTypes = {
  comment: React.PropTypes.object.isRequired, // the current comment
  currentUser: React.PropTypes.object, // the current user
}

module.exports = CommentItem;