import { Components, registerComponent, withDocument, getRawComponent } from 'meteor/vulcan:core';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Comments from 'meteor/vulcan:comments'
import { Well } from 'react-bootstrap';


class CommentInline extends getRawComponent('CommentsItem') {

  render() {
    const comment = this.props.comment;
    const content = comment.content;
    const htmlBody = {__html: comment.htmlBody};

    return (
      <div className="comment-inline">

        <div className="comment-inline-text">
          <Well>
            <div className="comment-inline-description">
              In reply to:
            </div>
            {content ? <Components.ContentRenderer state={content} /> :
            null}
            {htmlBody ? <div className="comment-inline-body" dangerouslySetInnerHTML={htmlBody}></div> : null}
          </Well>
        </div>
      </div>
    )
  }

}

const options = {
  collection: Comments,
  queryName: 'CommentWithContextQuery',
  fragmentName: 'CommentsList',
};

registerComponent('CommentInline', CommentInline);
