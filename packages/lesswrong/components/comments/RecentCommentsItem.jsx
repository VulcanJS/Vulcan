import { Components, getRawComponent, registerComponent } from 'meteor/vulcan:core';
import React from 'react';
import { FormattedMessage } from 'meteor/vulcan:i18n';
import moment from 'moment';
import Comments from "meteor/vulcan:comments";
import Posts from 'meteor/vulcan:posts';
import { Link } from 'react-router';
import Paper from 'material-ui/Paper';

import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

const paperStyle = {
  padding: '10px',
  backgroundColor: 'transparent',
}

const moreActionsMenuStyle = {
  position: 'inherit',
}

const moreActionsMenuButtonStyle = {
  padding: '0px',
  width: 'auto',
  height: 'auto',
}

const moreActionsMenuIconStyle = {
  padding: '0px',
  width: '16px',
  height: '16px',
  color: 'rgba(0,0,0,0.5)',
}

class RecentCommentsItem extends getRawComponent('CommentsItem') {

  // TODO: Make comments collapsible id:10

  render() {
    const comment = this.props.comment;

    return (
      <Paper
        className="comments-item recent-comments-item"
        style={paperStyle}
        zDepth={0}
        id={comment._id}
      >
        <Link to={Posts.getPageUrl(comment.post) + "/" + comment._id}>
          <div className="comments-item-body recent-comments-item-body ">
            <object><div className="comments-item-meta recent-comments-item-meta">
              <Components.UsersName user={comment.user}/>
              <div className="comments-item-vote recent-comments-item-vote ">
                <Components.Vote collection={Comments} document={comment} currentUser={this.props.currentUser}/>
              </div>
              <div className="comments-item-date">{moment(new Date(comment.postedAt)).fromNow()}</div>
              <div className="comments-item-origin">
                on <span className="comments-item-origin-post-title">{comment.post.title}</span>
              </div>
            </div></object>
            {this.state.showEdit ? this.renderEdit() : this.renderComment()}

          </div>
          {this.state.showReply ? this.renderReply() : null}
        </Link>
        <div className="comments-more-actions-menu">
          <object><IconMenu
            iconButtonElement={<IconButton style={moreActionsMenuButtonStyle}><MoreVertIcon /></IconButton>}
            anchorOrigin={{horizontal: 'right', vertical: 'top'}}
            targetOrigin={{horizontal: 'right', vertical: 'top'}}
            style={moreActionsMenuStyle}
            iconStyle={moreActionsMenuIconStyle}
          >
            <Components.ShowIf check={Comments.options.mutations.edit.check} document={comment}>
              <MenuItem onTouchTap={this.showEdit} primaryText="Edit" />
            </Components.ShowIf>
            <MenuItem><Components.SubscribeTo className="comments-subscribe" document={comment} /></MenuItem>
          </IconMenu></object>
        </div>
      </Paper>
    )
  }

  renderComment() {
    let content = this.props.comment.content;

    const htmlBody = {__html: this.props.comment.htmlBody};

    return (
      <div className="recent-comments-item-text comments-item-text">
        {content ? <Components.ContentRenderer state={content} /> :
        null}
        {htmlBody && !content ? <div className="recent-comment-body comment-body" dangerouslySetInnerHTML={htmlBody}></div> : null}
          {/*{ showReplyButton ? <a className="recent-comments-item-reply-link" onClick={this.showReply}>
            <Components.Icon name="reply"/> <FormattedMessage id="comments.reply"/>
          </a> : null} */}
      </div>
    )
  }

}

registerComponent('RecentCommentsItem', RecentCommentsItem);
