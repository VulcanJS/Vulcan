const PostItem = React.createClass({
  
  propTypes: {
    post: React.PropTypes.object.isRequired, // the current comment
    currentUser: React.PropTypes.object, // the current user
  },

  renderCategories() {

    ({PostCategories} = Telescope.components);

    return this.props.post.categoriesArray ? <PostCategories categories={this.props.post.categoriesArray} /> : "";
  },

  renderCommenters() {

    ({PostItemCommenters} = Telescope.components);

    return this.props.post.commentersArray ? <PostItemCommenters commenters={this.props.post.commentersArray}/> : "";
  },

  renderActions() {
    return (
      <ul>
        {Users.can.edit(this.props.currentUser, this.props.post) ? <li><a href={Posts.getEditUrl(this.props.post)}>Edit</a></li> : ""}
      </ul>
    )
  },
  
  render() {

    const post = this.props.post;

    return (
      <div className="post" style={{borderBottom: "2px solid #eee", paddingBottom: "10px", marginBottom: "10px"}}>
        
        <h3 className="post-title"><a href={Posts.getLink(post)} target={Posts.getLinkTarget(post)}>{post.title}</a></h3>
        <p>{Users.getDisplayName(post.user)}, {moment(post.postedAt).fromNow()}, {post.commentCount} comments</p>
        
        {this.renderCategories()}
        {this.renderCommenters()}
        {this.renderActions()}
      
      </div>
    )
  }
});

module.exports = PostItem;