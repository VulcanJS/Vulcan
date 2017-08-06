import { Components, getRawComponent, replaceComponent, ModalTrigger } from 'meteor/vulcan:core';
import React from 'react';
import { intlShape, FormattedMessage } from 'meteor/vulcan:i18n';
import { Link } from 'react-router';
import Posts from "meteor/vulcan:posts";
import Users from "meteor/vulcan:users";
import moment from 'moment';

class LWPostsItem extends getRawComponent('PostsItem') {

  renderActions() {
    const post = this.props.post;

    return (
      <div>
        <div className="posts-actions">
          <Link to={{pathname:'/editPost', query:{postId: post._id}}}>
            Edit
          </Link>
        </div>
      </div>

    )
  }



  render() {

    const {post} = this.props;

    let postClass = "posts-item";
    if (post.sticky) postClass += " posts-sticky";

    return (
      <div className={postClass}>

        <div className="posts-item-vote">
          <Components.Vote collection={Posts} document={post} currentUser={this.props.currentUser}/>
        </div>

        {post.thumbnailUrl ? <Components.PostsThumbnail post={post}/> : null}

        <div className="posts-item-content">

          <h3 className="posts-item-title">
            <Link to={Posts.getLink(post)} className="posts-item-title-link" target={Posts.getLinkTarget(post)}>
              {post.title}
            </Link>
            {this.renderCategories()}
            {this.renderPostFeeds()}
          </h3>

          <div className="posts-item-meta">
            {post.user? <div className="posts-item-user"><Components.UsersAvatar user={post.user} size="small"/><Components.UsersName user={post.user}/></div> : null}
            <div className="posts-item-date">{post.postedAt ? moment(new Date(post.postedAt)).fromNow() : <FormattedMessage id="posts.dateNotDefined"/>}</div>
            <div className="posts-item-comments">
              <Link to={Posts.getPageUrl(post)}>
                {!post.commentCount || post.commentCount === 0 ? <FormattedMessage id="comments.count_0"/> :
                  post.commentCount === 1 ? <FormattedMessage id="comments.count_1" /> :
                    <FormattedMessage id="comments.count_2" values={{count: post.commentCount}}/>
                }
              </Link>
            </div>
            {this.props.currentUser && this.props.currentUser.isAdmin ? <Components.PostsStats post={post} /> : null}
            {Posts.options.mutations.edit.check(this.props.currentUser, post) ? this.renderActions() : null}
            {/* Added subscribe-to functionality */}
            <Components.SubscribeTo className="posts-item-subscribe" document={post} />
          </div>

        </div>

        {this.renderCommenters()}

      </div>
    )
  }
}

replaceComponent('PostsItem', LWPostsItem);
