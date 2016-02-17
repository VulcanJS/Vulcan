const PostItem2 = props => {
  return (
    <div className="post">
      <h3><a href={FlowRouter.path("post", props)}>xyz/{props.title}</a></h3>
      <p>{props.url}</p>
    </div>
  )
};

// export default PostItem;

module.exports = PostItem2;