const CategoriesList = props => {

  return (
    <ul className="post-categories">
      {props.results.map(category => 
        <li key={category._id} className="post-category"><a href={FlowRouter.extendPathWithQueryParams("postDefault", {}, {cat: category.slug})}>{category.name}</a></li>
      )}
    </ul>
  )
  
};

module.exports = CategoriesList;