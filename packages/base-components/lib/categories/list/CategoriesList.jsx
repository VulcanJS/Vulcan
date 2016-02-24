const CategoriesList = props => {

  return (
    <div className="categories">
      <h4>Categories</h4>
      <ul>
        {props.results.map(category => 
          <li key={category._id} className="post-category"><a href={FlowRouter.extendPathWithQueryParams("posts.list", {}, {cat: category.slug})}>{category.name}</a></li>
        )}
      </ul>
    </div>
  )
  
};

module.exports = CategoriesList;