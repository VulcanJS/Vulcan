import { Components, registerComponent, withCurrentUser, withMessages } from 'meteor/vulcan:core';
import React, { PropTypes, Component } from 'react';
import { intlShape, FormattedMessage, FormattedRelative } from 'react-intl';
import Comments from 'meteor/vulcan:comments';

class CommentsItem extends Component{

  constructor() {
    super();
    ['showReply', 'replyCancelCallback', 'replySuccessCallback', 'showEdit', 'editCancelCallback', 'editSuccessCallback', 'removeSuccessCallback'].forEach(methodName => {this[methodName] = this[methodName].bind(this)});
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

  removeSuccessCallback({documentId}) {
    const deleteDocumentSuccess = this.context.intl.formatMessage({id: 'comments.delete_success'});
    this.props.flash(deleteDocumentSuccess, "success");
    // todo: handle events in async callback
    // this.context.events.track("comment deleted", {_id: documentId});
  }

  renderComment() {
    const htmlBody = {__html: this.props.comment.htmlBody};

    const showReplyButton = !this.props.comment.isDeleted && !!this.props.currentUser;

    return (
      <div className="comments-item-text">
        <div dangerouslySetInnerHTML={htmlBody}></div>
        { showReplyButton ?
          <a className="comments-item-reply-link" onClick={this.showReply}>
            <Components.Icon name="reply"/> <FormattedMessage id="comments.reply"/>
          </a> : null}
      </div>
    )
  }

  renderReply() {

    return (
      <div className="comments-item-reply">
        <Components.CommentsNewForm
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
      <Components.CommentsEditForm
        comment={this.props.comment}
        successCallback={this.editSuccessCallback}
        cancelCallback={this.editCancelCallback}
        removeSuccessCallback={this.removeSuccessCallback}
      />
    )
  }

  render() {
    const comment = this.props.comment;

    return (
      <div className="comments-item" id={comment._id}>
        <div className="comments-item-body">
          <div className="comments-item-meta">
            <div className="comments-item-vote">
              <Components.Vote collection={Comments} document={this.props.comment} currentUser={this.props.currentUser}/>
            </div>
            <Components.UsersAvatar size="small" user={comment.user}/>
            <Components.UsersName user={comment.user}/>
            <div className="comments-item-date"><FormattedRelative value={comment.postedAt}/></div>
            <Components.ShowIf check={Comments.options.mutations.edit.check} document={this.props.comment}>
              <div>
                <a className="comment-edit" onClick={this.showEdit}><FormattedMessage id="comments.edit"/></a>
              </div>
            </Components.ShowIf>
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
  currentUser: React.PropTypes.object,
};

CommentsItem.contextTypes = {
  events: React.PropTypes.object,
  intl: intlShape
};

registerComponent('CommentsItem', CommentsItem, withCurrentUser, withMessages);
