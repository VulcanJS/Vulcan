const PostItem = props => {
  
  ({PostCategories} = Telescope.components);

  return (
    <div className="post">
      <h3 className="post-title"><a href={Posts.getLink(props)} target={Posts.getLinkTarget(props)}>{props.title}</a></h3>
      {props.categories ? <PostCategories categories={props.categoriesArray} /> : ""}
      <p>{props.commentCount} comments</p>
      <a href={Posts.getEditUrl(props)}>Edit</a>
      <p>{props.url}</p>
    </div>
  )
};

// export default PostItem;

module.exports = PostItem;