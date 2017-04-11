import { Components, getRawComponent, replaceComponent } from 'meteor/vulcan:core';
import React from 'react';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import { Link } from 'react-router';
import Posts from "meteor/vulcan:posts";

class LWPostsPage extends getRawComponent('PostsPage') {

  render() {
    if (this.props.loading) {

      return <div className="posts-page"><Components.Loading/></div>

    } else if (!this.props.document) {

      console.log(`// missing post (_id: ${this.props.documentId})`);
      return <div className="posts-page"><FormattedMessage id="app.404"/></div>

    } else {
      const post = this.props.document;
      const htmlBody = {__html: post.htmlBody};

      return (
        <div className="posts-page">
          <Components.HeadTags url={Posts.getPageUrl(post)} title={post.title} image={post.thumbnailUrl} description={post.excerpt} />

          <Components.PostsItem post={post} currentUser={this.props.currentUser} />

          {post.htmlBody ? <div className="posts-page-body" dangerouslySetInnerHTML={htmlBody}></div> : null}

          {/* Adding draftJS rendering here */}

          {post.draftJS ? <Components.EditorWrapper initialState={post.draftJS} readOnly /> : null}


          <Components.PostsCommentsThread terms={{postId: post._id, view: 'postComments'}} />

        </div>
      );

    }
  };
}

replaceComponent('PostsPage', LWPostsPage);
