import React from 'react';
import Router from '../../router.js';

const PostCategories = ({post}) => {
  return (
    <div className="post-categories">
      {post.categoriesArray.map(category => <a key={category._id} href={Router.path("posts.list", {}, {cat: category.slug})}>{category.name}</a>)}
    </div>
  )
};

module.exports = PostCategories;