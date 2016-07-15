import React, { PropTypes, Component } from 'react';
import moment from 'moment';
import { intlShape, FormattedMessage, FormattedRelative } from 'react-intl';
import Users from 'meteor/nova:users';

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
    const deleteConfirmMessage = this.context.intl.formatMessage({id: "comments.delete_confirm"}, {body: Telescope.utils.trimWords(comment.body, 20)});
    const deleteSuccessMessage = this.context.intl.formatMessage({id: "comments.delete_success"}, {body: Telescope.utils.trimWords(comment.body, 20)});
    
    if (window.confirm(deleteConfirmMessage)) {
      this.context.actions.call('comments.deleteById', comment._id, (error, result) => {
        this.context.messages.flash(deleteSuccessMessage, "success");
        this.context.events.track("comment deleted", {'_id': comment._id});
      });
    }

  }

  renderComment() {
    const htmlBody = {__html: this.props.comment.htmlBody};

    return (
      <div className="comments-item-text">
        <div dangerouslySetInnerHTML={htmlBody}></div>
        {!this.props.comment.isDeleted ? <a className="comments-item-reply-link" onClick={this.showReply}><Telescope.components.Icon name="reply"/> <FormattedMessage id="comments.reply"/></a> : null} 
      </div>  
    )
  }

  renderReply() {

    return (
      <div className="comments-item-reply">
        <Telescope.components.CommentsNew 
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

    return (
      <Telescope.components.CommentsEdit 
        comment={this.props.comment} 
        successCallback={this.editSuccessCallback} 
        cancelCallback={this.editCancelCallback}
      />
    )
  }

  render() {
    const comment = this.props.comment;

    return (
      <div className="comments-item" id={comment._id}>
        <div className="comments-item-body">
          <div className="comments-item-meta">
            <Telescope.components.UsersAvatar size="small" user={comment.user}/>
            <Telescope.components.UsersName user={comment.user}/>
            <div className="comments-item-date"><FormattedRelative value={comment.postedAt}/></div>
            {Users.can.edit(this.props.currentUser, this.props.comment) ? <a className="comment-edit" onClick={this.showEdit}><FormattedMessage id="comments.edit"/></a> : null}
            {Users.can.edit(this.props.currentUser, this.props.comment) ? <a className="comment-delete" onClick={this.deleteComment}><FormattedMessage id="comments.delete"/></a> : null}
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

CommentsItem.contextTypes = {
  actions: React.PropTypes.object,
  messages: React.PropTypes.object,
  events: React.PropTypes.object,
  intl: intlShape
}

module.exports = CommentsItem;
