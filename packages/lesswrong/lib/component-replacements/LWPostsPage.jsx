import { Components, getRawComponent, replaceComponent } from 'meteor/vulcan:core';
import withNewEvents from '../events/withNewEvents.jsx';
import React from 'react';
import { intlShape, FormattedMessage } from 'meteor/vulcan:i18n';
import { withRouter } from 'react-router'
import { LinkContainer } from 'react-router-bootstrap';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import Posts from 'meteor/vulcan:posts';


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

      // console.log(`// missing post (_id: ${this.props.documentId})`);
      return <div className="posts-page"><FormattedMessage id="app.404"/></div>

    } else {
      const post = this.props.document;
      const userId = this.props.currentUser && this.props.currentUser._id;
      const htmlBody = {__html: post.htmlBody};

      let commentHash = this.props.params.commentId;
      if (commentHash){
        commentHash = commentHash.length == 17 && commentHash;
      }
      // Check for "context" as last part of the hash and ignore it if it exists
      // TODO: Make this less ugly
      if (commentHash && commentHash.substring(commentHash.length - 7, commentHash.length) === "context") {
        commentHash = commentHash.slice(0,-7);
      }


      return (
        <div className="posts-page">
          <Components.HeadTags url={Posts.getPageUrl(post)} title={post.title} image={post.thumbnailUrl} description={post.excerpt} />
          {commentHash ? <div className="posts-comments-thread-linked-comment">
              <Components.CommentWithContextWrapper documentId={commentHash} />
          </div> : null}
          <Components.PostsItem post={post} currentUser={this.props.currentUser} />



          {post.htmlBody && !post.content ? <div className="posts-page-body" dangerouslySetInnerHTML={htmlBody}></div> : null}

          {/* Adding content rendering here */}
          {post.content ? <div className="posts-page-content"> <Components.ContentRenderer state={post.content} /> </div> : null}

          {/* comment view selector and comment thread */}
          { this.renderCommentViewSelector() }
          <Components.PostsCommentsThreadWrapper terms={{postId: post._id, view: this.getView()}} userId={userId} />
        </div>
      );
    }
  }

  async componentDidMount() {
    try {

      // destructure the relevant props
      const {
        // from the parent component, used in withDocument, GraphQL HOC
        documentId,
        // from connect, Redux HOC
        setViewed,
        postsViewed,
        // from withMutation, GraphQL HOC
        increasePostViewCount,
      } = this.props;

      // a post id has been found & it's has not been seen yet on this client session
      if (documentId && !postsViewed.includes(documentId)) {

        // trigger the asynchronous mutation with postId as an argument
        await increasePostViewCount({postId: documentId});

        // once the mutation is done, update the redux store
        setViewed(documentId);
      }

      //LESSWRONG: register page-visit event
      if(this.props.currentUser) {
        const registerEvent = this.props.registerEvent;
        const currentUser = this.props.currentUser;
        const eventProperties = {
          userId: currentUser._id,
          important: false,
          intercom: true,
        };

        if(this.props.document) {
          const post = this.props.document;
          eventProperties.documentId = post._id;
          eventProperties.postTitle = post.title;
        }
        // console.log("Registered event: ", eventProperties);
        registerEvent('post-view', eventProperties);
      }



    } catch(error) {
      console.log(error); // eslint-disable-line
    }
  }
}

LWPostsPage.contextTypes = {
  intl: intlShape
}

replaceComponent('PostsPage', LWPostsPage, withRouter, withNewEvents);
