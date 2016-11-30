import Telescope from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import { Button } from 'react-bootstrap';
import moment from 'moment';
import { ModalTrigger } from "meteor/nova:core";
import { Link } from 'react-router';
import Posts from "meteor/nova:posts";
import Users from 'meteor/nova:users';
import { withCurrentUser } from 'meteor/nova:core';
import gql from 'graphql-tag';

class PostsItem extends Component {

  renderCategories() {
    return this.props.post.categories && this.props.post.categories.length > 0 ? <Telescope.components.PostsCategories post={this.props.post} /> : "";
  }

  renderCommenters() {
    return this.props.post.commenters && this.props.post.commenters.length > 0 ? <Telescope.components.PostsCommenters post={this.props.post}/> : "";
  }

  renderActions() {
    return (
      <div className="post-actions">
        <ModalTrigger title="Edit Post" component={<a className="posts-action-edit"><FormattedMessage id="posts.edit"/></a>}>
          <Telescope.components.PostsEditForm post={this.props.post} />
        </ModalTrigger>
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
          <Telescope.components.Vote post={post}/>
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
            <div className="posts-item-date">{post.postedAt ? <FormattedRelative value={post.postedAt}/> : <FormattedMessage id="posts.dateNotDefined"/>}</div>
            <div className="posts-item-comments">
              <Link to={Posts.getPageUrl(post)}>
                <FormattedMessage id="comments.count" values={{count: post.commentCount}}/>
              </Link>
            </div>
            {this.props.currentUser && this.props.currentUser.isAdmin ? <Telescope.components.PostsStats post={post} /> : null}
            {Posts.options.mutations.edit.check(this.props.currentUser, post) ? this.renderActions() : null}
          </div>

        </div>

        {this.renderCommenters()}
      
      </div>
    )
  }
};
  
PostsItem.propTypes = {
  currentUser: React.PropTypes.object,
  post: React.PropTypes.object.isRequired,
};

PostsItem.fragmentName = 'PostsItemFragment';
PostsItem.fragment = gql`
  fragment PostsItemFragment on Post {
    _id
    title
    url
    slug
    thumbnailUrl
    baseScore
    postedAt
    sticky
    status
    categories {
      # ...minimumCategoryInfo
      _id
      name
      slug
    }
    commentCount
    commenters {
      # ...avatarUserInfo
      _id
      __displayName
      __emailHash
      __slug
    }
    upvoters {
      _id
    }
    downvoters {
      _id
    }
    upvotes # should be asked only for admins?
    score # should be asked only for admins?
    viewCount # should be asked only for admins?
    clickCount # should be asked only for admins?
    user {
      # ...avatarUserInfo
      _id
      __displayName
      __emailHash
      __slug
    }
    userId
  }
`;

Telescope.registerComponent('PostsItem', PostsItem, withCurrentUser);