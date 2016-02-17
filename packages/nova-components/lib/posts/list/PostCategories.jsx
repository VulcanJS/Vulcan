const PostCategories = props => {
  return (
    <ul>
      {props.categories.map(category => <li key={category._id}><a href={FlowRouter.path("postDefault", {}, {cat: category.slug})}>{category.name}</a></li>)}
    </ul>
  )
};

module.exports = PostCategories;