const PostListHeader = () => {

  ({PostViews, SearchForm, ListContainer, CategoriesList} = Telescope.components)

  return (
    <div className="post-list-header">
      <div className="post-list-categories">
        <ListContainer collection={Categories} limit={0} resultsPropName="categories" component={CategoriesList}/>
      </div>
      <PostViews />
      <SearchForm/>
    </div>
  )
}

module.exports = PostListHeader;
export default PostListHeader;