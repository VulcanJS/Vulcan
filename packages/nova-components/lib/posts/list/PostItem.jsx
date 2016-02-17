const PostItem = props => {
  
  ({PostCategories, PostItemCommenters} = Telescope.components);

  return (
    <div className="post">
      <h3 className="post-title"><a href={Posts.getLink(props)} target={Posts.getLinkTarget(props)}>{props.title}</a></h3>
      {props.categoriesArray ? <PostCategories categories={props.categoriesArray} /> : ""}
      <p>{Users.getDisplayName(props.user)}, {moment(props.postedAt).fromNow()}, {props.commentCount} comments</p>
      <a href={Posts.getEditUrl(props)}>Edit</a>
      {props.commentersArray ? <PostItemCommenters commenters={props.commentersArray}/> : ""}
    </div>
  )
};

// export default PostItem;

module.exports = PostItem;