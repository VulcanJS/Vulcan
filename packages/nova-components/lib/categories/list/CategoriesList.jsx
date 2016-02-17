const CategoriesList = props => {

  return (
    <ul>
      {props.results.map(category => <li key={category._id}>{category.name}</li>)}
    </ul>
  )
  
};

module.exports = CategoriesList;