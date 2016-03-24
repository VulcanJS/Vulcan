const PostListHeader = () => {

  ({PostViews, SearchForm} = Telescope.components)

  return <div className="post-list-header"><PostViews /><SearchForm/></div>
}

module.exports = PostListHeader;
export default PostListHeader;