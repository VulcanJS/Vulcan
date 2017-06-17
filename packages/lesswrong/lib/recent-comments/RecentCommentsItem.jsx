import { Components, getRawComponent, registerComponent } from 'meteor/vulcan:core';
import React from 'react';
import { FormattedMessage } from 'meteor/vulcan:i18n';
import moment from 'moment';
import Comments from "meteor/vulcan:comments";

import Editor, { Editable, createEmptyState } from 'ory-editor-core';

class RecentCommentsItem extends getRawComponent('CommentsItem') {

  // TODO: Make comments collapsible id:10
  // TODO: Create unique comment-links id:16

  render() {
    const comment = this.props.comment;

    return (
      <div className="comments-item recent-comments-item" id={comment._id}>
        <div className="comments-item-body recent-comments-item-body ">
          <div className="comments-item-meta recent-comments-item-meta">
            <div className="comments-item-vote recent-comments-item-vote ">
              <Components.Vote collection={Comments} document={this.props.comment} currentUser={this.props.currentUser}/>
            </div>
            <Components.UsersAvatar size="small" user={comment.user}/>
            <Components.UsersName user={comment.user}/>
            <div className="comments-item-date">{moment(new Date(comment.postedAt)).fromNow()}</div>
            <Components.ShowIf check={Comments.options.mutations.edit.check} document={this.props.comment}>
              <div>
                <a className="comment-edit" onClick={this.showEdit}><FormattedMessage id="comments.edit"/></a>
              </div>
            </Components.ShowIf>
            <Components.SubscribeTo document={comment} />
          </div>
          {this.state.showEdit ? this.renderEdit() : this.renderComment()}
        </div>
        {this.state.showReply ? this.renderReply() : null}
      </div>
    )
  }

  renderComment() {
    let content = this.props.comment.content;

    const htmlBody = {__html: this.props.comment.htmlBody};
    const showReplyButton = !this.props.comment.isDeleted && !!this.props.currentUser;

    return (
      <div className="recent-comments-item-text comments-item-text">
        {content ? <Components.ContentRenderer state={content} /> :
        null}
        {htmlBody ? <div className="recent-comment-body comment-body" dangerouslySetInnerHTML={htmlBody}></div> : null}
          {/*{ showReplyButton ? <a className="recent-comments-item-reply-link" onClick={this.showReply}>
            <Components.Icon name="reply"/> <FormattedMessage id="comments.reply"/>
          </a> : null} */}
      </div>
    )
  }

}

registerComponent('RecentCommentsItem', RecentCommentsItem);
