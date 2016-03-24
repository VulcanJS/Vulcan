import React, { PropTypes, Component } from 'react';
import { Button } from 'react-bootstrap';

class PostItem extends Component {

  renderCategories() {

    ({PostCategories} = Telescope.components);

    return this.props.post.categoriesArray ? <PostCategories categories={this.props.post.categoriesArray} /> : "";
  }

  renderCommenters() {

    ({PostCommenters} = Telescope.components);

    return this.props.post.commentersArray ? <PostCommenters commenters={this.props.post.commentersArray}/> : "";
  }

  renderActions() {

    ({ModalTrigger, DocumentContainer, EditDocContainer} = Telescope.components);

    const component = (
      <ModalTrigger component={<Button bsStyle="info">Edit</Button>}>
        <EditDocContainer 
          collection={Posts} 
          document={this.props.post} 
          label="Edit Post" 
          methodName="posts.edit"
        />
      </ModalTrigger>
    );

    return (
      <div className="post-actions">
        {Users.can.edit(this.props.currentUser, this.props.post) ? component : ""}
      </div>
    )
  }
  
  render() {

    ({UserAvatar, Vote, PostStats} = Telescope.components);

    const post = this.props.post;

    return (
      <div className="post-item">
        
        <Vote post={post} currentUser={this.props.currentUser}/>
        <h3 className="post-title"><a href={Posts.getLink(post)} target={Posts.getLinkTarget(post)}>{post.title}</a></h3>
        <p><a href={Users.getProfileUrl(post.user)}><UserAvatar user={post.user}/>{Users.getDisplayName(post.user)}</a>, {moment(post.postedAt).fromNow()}, {post.commentCount} comments</p>
        
        <PostStats post={post} />

        {this.renderCategories()}
        {this.renderCommenters()}
        {this.renderActions()}
      
      </div>
    )
  }
};
  
PostItem.propTypes = {
  post: React.PropTypes.object.isRequired, // the current comment
  currentUser: React.PropTypes.object, // the current user
}

module.exports = PostItem;