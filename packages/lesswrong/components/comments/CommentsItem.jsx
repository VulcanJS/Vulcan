import { Components, getRawComponent, replaceComponent } from 'meteor/vulcan:core';
import React from 'react';
import { withRouter, Link } from 'react-router';
import { FormattedMessage } from 'meteor/vulcan:i18n';
import Comments from "meteor/vulcan:comments";
import moment from 'moment';

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


class CommentsItem extends getRawComponent('CommentsItem') {

  // TODO: Make comments collapsible id:18
  // TODO: Create unique comment-links id:14

  render() {
    const comment = this.props.comment;
    const params = this.props.router.params;
    const commentLink = "/posts/"+params._id+"/"+params.slug+"/"+comment._id;
    const showReplyButton = !this.props.comment.isDeleted && !!this.props.currentUser;

    return (
      <div className="comments-item" id={comment._id}>
        <div className="comments-item-body">
          <div className="comments-item-meta">
            <Components.UsersName user={comment.user}/>
            <div className="comments-item-vote">
              <Components.Vote collection={Comments} document={this.props.comment} currentUser={this.props.currentUser}/>
            </div>
            <div className="comments-item-date"><Link to={commentLink}>{moment(new Date(comment.postedAt)).fromNow()} </Link></div>
          </div>
          {this.state.showEdit ? this.renderEdit() : this.renderComment()}
          <div className="comments-item-bottom">
            { showReplyButton ?
              <a className="comments-item-reply-link" onClick={this.showReply}>
                <FormattedMessage id="comments.reply"/>
              </a> : null } <div className="comments-item-vote"><Components.Vote collection={Comments} document={this.props.comment} currentUser={this.props.currentUser}/></div>
          </div>
        </div>
        {this.state.showReply ? this.renderReply() : null}
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
      </div>
    )
  }

  renderComment() {
    let content = this.props.comment.content;

    const htmlBody = {__html: this.props.comment.htmlBody};

    return (
      <div className="comments-item-text">
        {content ? <Components.ContentRenderer state={content} /> :
        null}
        {htmlBody && !content ? <div className="comment-body" dangerouslySetInnerHTML={htmlBody}></div> : null}

      </div>
    )
  }

}

replaceComponent('CommentsItem', CommentsItem, withRouter);
