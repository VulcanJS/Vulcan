import React from 'react';
import Router from '../router.js';

const PostsCategories = ({post}) => {
  return (
    <div className="post-categories">
      {post.categoriesArray.map(category => <a key={category._id} href={Router.path("posts.list", {}, {cat: category.slug})}>{category.name}</a>)}
    </div>
  )
};

module.exports = PostsCategories;