import Router from '../../router.js';

const PostCategories = ({categories}) => {
  return (
    <div className="post-categories">
      <h4>Categories</h4>
      <ul>
        {categories.map(category => <li key={category._id}><a href={Router.path("posts.list", {}, {cat: category.slug})}>{category.name}</a></li>)}
      </ul>
    </div>
  )
};

module.exports = PostCategories;