import { Components, getRawComponent, registerComponent } from 'meteor/vulcan:core';
import React from 'react';
import { FormattedMessage } from 'meteor/vulcan:i18n';
import Comments from "meteor/vulcan:comments";
import moment from 'moment';
import { Link, withRouter } from 'react-router';

class CommentWithContext extends getRawComponent('CommentsItem') {

  // TODO: Make comments collapsible id:18
  // TODO: Create unique comment-links id:14

  // LESSWRONG: Changed the comments-item id, but nothing else
  render() {
    const comment = this.props.comment;
    const params = this.props.router.params;
    const commentLink = "/posts/"+params._id+"/"+params.slug+"/"+comment._id;
    const showReplyButton = !this.props.comment.isDeleted && !!this.props.currentUser;

    return (
      <div className="comments-item comments-item-context" id={comment._id+"top"}>
        <div className="comments-item-body">
          <div className="comments-item-meta">
            <Components.UsersName user={comment.user}/>
            <div className="comments-item-vote">
              <Components.Vote collection={Comments} document={this.props.comment} currentUser={this.props.currentUser}/>
            </div>

            <Components.ShowIf check={Comments.options.mutations.edit.check} document={this.props.comment}>
              <div>
                <a className="comment-edit" onClick={this.showEdit}><FormattedMessage id="comments.edit"/></a>
              </div>
            </Components.ShowIf>
            {/* <Components.SubscribeTo document={comment} /> */}
            <div className="comments-item-date"><Link to={commentLink}>{moment(new Date(comment.postedAt)).fromNow()} </Link></div>
          </div>
          {this.state.showEdit ? this.renderEdit() : this.renderComment()}
        </div>
        {this.state.showReply ? this.renderReply() : null}
      </div>
    )
  }

  renderComment() {
    const comment = this.props.comment;
    const content = comment.content;
    const htmlBody = {__html: comment.htmlBody};
    const showReplyButton = !comment.isDeleted && !!this.props.currentUser;

    return (
      <div className="comments-item-text">
        {comment.parentCommentId ? <Components.CommentInlineWrapper documentId={comment.parentCommentId} /> : null}
        {content ? <Components.ContentRenderer state={content} /> :
        null}
        {htmlBody && !content ? <div className="comment-body" dangerouslySetInnerHTML={htmlBody}></div> : null}
        { showReplyButton ?
          <a className="comments-item-reply-link" onClick={this.showReply}>
            <Components.Icon name="reply"/> <FormattedMessage id="comments.reply"/>
          </a> : null}
        <div className="comment-context-link"> <a href={"#"+comment._id}>See comment in full context</a> </div>
      </div>
    )
  }
}

registerComponent('CommentWithContext', CommentWithContext, withRouter);
