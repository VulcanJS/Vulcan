import React, { PropTypes, Component } from 'react';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import { Button, Tooltip } from 'react-bootstrap';
import moment from 'moment';
import { ModalTrigger } from "meteor/nova:core";
import { Link } from 'react-router';
import Posts from "meteor/nova:posts";
import Categories from "meteor/nova:categories";

class CustomPostsItem extends Telescope.components.PostsItem {

  constructor(props, context) {
    super(props, context);

    this.renderSubscribeButton = this.renderSubscribeButton.bind(this);
    this.onSubscribe = this.onSubscribe.bind(this);
    this.isSubscribed = this.isSubscribed.bind(this);
  }

  isSubscribed(post, user) {
    if (!post || !user)
      return false;
    return post.subscribers && post.subscribers.indexOf(user._id) != -1;
  }

  renderSubscribeButton() {
    const post = this.props.post;
    const user = this.context.currentUser;

    let btnStyle = "default";

    let isSubscribed = this.isSubscribed(post, user);
    if( isSubscribed ) {
      btnStyle = "info";
    }

    return (
      <button type="button" title="Observe"
        className={`btn btn-${btnStyle} btn-sm pull-right`}
        style={{padding: '.5rem', lineHeight: 1, borderRadius: '50%', marginLeft: '.5rem'}}
        onClick={this.onSubscribe} >
        <i className="fa fa-eye"></i>
      </button>
    )
  }

  onSubscribe() {
    const post = this.props.post;
    const user = this.context.currentUser;

    let callAction = 'subscribePost';

    let isSubscribed = this.isSubscribed(post, user);
    if( isSubscribed ) {
      callAction = "unsubscribePost";
    }

    this.context.actions.call(callAction, post._id, (error, result) => {
      if (result)
        this.context.events.track(callAction, {'_id': post._id});
    })
  }

  render() {

    const post = this.props.post;
    const user = this.context.currentUser;

    let postClass = "posts-item";
    if (post.sticky) postClass += " posts-sticky";

    // ⭐ custom code starts here ⭐
    if (post.color) {
      postClass += " post-"+post.color;
    }
    // ⭐ custom code ends here ⭐

    return (
      <div className={postClass}>

        <div className="posts-item-vote">
          <Telescope.components.Vote post={post} currentUser={this.context.currentUser}/>
        </div>

        {post.thumbnailUrl ? <Telescope.components.PostsThumbnail post={post}/> : null}

        <div className="posts-item-content">

          <h3 className="posts-item-title">
            <Link to={Posts.getLink(post)} className="posts-item-title-link" target={Posts.getLinkTarget(post)}>
              {post.title}
            </Link>
            {this.renderCategories()}
          </h3>

          <div className="posts-item-meta">
            {post.user? <div className="posts-item-user"><Telescope.components.UsersAvatar user={post.user} size="small"/><Telescope.components.UsersName user={post.user}/></div> : null}
            <div className="posts-item-date"><FormattedRelative value={post.postedAt}/></div>
            <div className="posts-item-comments">
              <Link to={Posts.getPageUrl(post)}>
                <FormattedMessage id="comments.count" values={{count: post.commentCount}}/>
              </Link>
            </div>
            {(this.context.currentUser && this.context.currentUser.isAdmin) ?<Telescope.components.PostsStats post={post} />:null}
            {this.renderActions()}
          </div>

        </div>

        {this.renderCommenters()}

        {(user && post.author !== user.username) ? this.renderSubscribeButton() : null}

      </div>
    )
  }
};

CustomPostsItem.propTypes = {
  post: React.PropTypes.object.isRequired
}

CustomPostsItem.contextTypes = {
  currentUser: React.PropTypes.object,
  actions: React.PropTypes.object,
  events: React.PropTypes.object
};

export default CustomPostsItem;
