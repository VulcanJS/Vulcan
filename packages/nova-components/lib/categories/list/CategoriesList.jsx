const CategoriesList = props => {

  return (
    <ul>
      {props.results.map(category => <li key={category._id}><a href={FlowRouter.extendPathWithQueryParams("postDefault", {}, {cat: category.slug})}>{category.name}</a></li>)}
    </ul>
  )
  
};

module.exports = CategoriesList;