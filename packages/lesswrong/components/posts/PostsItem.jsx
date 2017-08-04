import { Components, replaceComponent, withCurrentUser} from 'meteor/vulcan:core';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import Posts from "meteor/vulcan:posts";
import moment from 'moment';

import CommentIcon from 'material-ui/svg-icons/editor/mode-comment';
import IconButton from 'material-ui/IconButton';
import Badge from 'material-ui/Badge';
import Paper from 'material-ui/Paper';

import h2p from 'html2plaintext';

const paperStyle = {
  padding: 20,
  backgroundColor: 'transparent',
}


class PostsItem extends PureComponent {

  constructor(props) {
    super(props);
    this.state = { shadow: 0};
  }

  onMouseOver = () => this.setState({shadow: 2});
  onMouseOut = () => this.setState({shadow: 0});
  //
  // renderCategories() {
  //   return this.props.post.categories && this.props.post.categories.length > 0 ? <Components.PostsCategories post={this.props.post} /> : "";
  // }
  //
  // renderCommenters() {
  //   return this.props.post.commenters && this.props.post.commenters.length > 0 ? <Components.PostsCommenters post={this.props.post}/> : "";
  // }
  //
  renderActions() {
    return (
      <div className="posts-actions">
        <Link to={{pathname:'/editPost', query:{postId: this.props.post._id}}}>
          Edit
        </Link>
      </div>
    )
  }


  render() {

    const {post} = this.props;

    let postClass = "posts-item";
    if (post.sticky) postClass += " posts-sticky";



    return (
      <Paper
        style={paperStyle}
        zDepth={this.state.shadow}
        onMouseOver={this.onMouseOver}
        onMouseOut={this.onMouseOut}
      >
        <div className={postClass}>
          <div>
            <h3 className="posts-item-title">
              <Link to={Posts.getLink(post)} className="posts-item-title-link" target={Posts.getLinkTarget(post)}>
                {post.title}
              </Link>
            </h3>

            <div className="posts-item-meta">
              {post.postedAt ? <div className="posts-item-date"> {moment(new Date(post.postedAt)).fromNow()} </div> : null}
              {post.user ? <div className="posts-item-user"><Components.UsersName user={post.user}/></div> : null}
              <div className="posts-item-vote"> <Components.Vote collection={Posts} document={post} currentUser={this.props.currentUser}/> </div>
              {Posts.options.mutations.edit.check(this.props.currentUser, post) ? this.renderActions() : null}
              {this.props.currentUser && this.props.currentUser.isAdmin ? <div className="posts-item-admin"><Components.PostsStats post={post} /></div> : null}
            </div>
            <div className="posts-item-summary">
              {post.excerpt ?  post.excerpt  : h2p(post.htmlBody).slice(0,140)}
            </div>
          </div>
          <div className="posts-item-comments">
            <Badge
              className="posts-item-comment-count"
              badgeContent={post.commentCount}
              secondary={true}
              badgeStyle={{top:12, right:12}}
            >
              <IconButton tooltip="Comments" containerElement={<Link to={Posts.getPageUrl(post)} />}>
                <CommentIcon />
              </IconButton>
            </Badge>
          </div>
        </div>
      </Paper>
    )
  }
}

PostsItem.propTypes = {
  currentUser: PropTypes.object,
  post: PropTypes.object.isRequired,
  terms: PropTypes.object,
};

replaceComponent('PostsItem', PostsItem, withCurrentUser);
