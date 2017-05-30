import { Components, getRawComponent, replaceComponent } from 'meteor/vulcan:core';
import React from 'react';
import { intlShape, FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router'
import { LinkContainer } from 'react-router-bootstrap';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import Posts from 'meteor/vulcan:posts';

import withNewEditor from '../editor/withNewEditor.jsx';


class LWPostsPage extends getRawComponent('PostsPage') {

  renderCommentViewSelector() {

    let views = ["top", "new"];
    const query = _.clone(this.props.router.location.query);

    return (
      <DropdownButton
        bsStyle="default"
        className="views btn-secondary"
        title={this.context.intl.formatMessage({id: "posts.view"})}
        id="views-dropdown"
      >
        {views.map(view =>
          <LinkContainer key={view} to={{pathname: this.props.router.location.pathname, query: {...query, view: view}}} className="dropdown-item">
            <MenuItem>
              { /* borrow the text from post views */ }
              <FormattedMessage id={"posts."+view}/>
            </MenuItem>
          </LinkContainer>
        )}
      </DropdownButton>
    )

  }

  getView() {
    switch(this.props.router.location.query.view) {
        case 'top':
          return 'postCommentsTop';
        case 'new':
          return 'postCommentsNew';
    }

    // default to top
    return 'postCommentsTop';
  }

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
          {post.draftJS ? <Components.PostEditor initialState={post.draftJS} readOnly /> : null}

          {/* comment view selector and comment thread */}
          { this.renderCommentViewSelector() }
          <Components.PostsCommentsThread terms={{postId: post._id, view: this.getView()}} />
        </div>
      );
    }
  }

}

LWPostsPage.contextTypes = {
  intl: intlShape
}

replaceComponent('PostsPage', withNewEditor(LWPostsPage), withRouter);
