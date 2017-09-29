import React from 'react';
import { Posts } from '../../modules/posts/index.js';
import { Link } from 'react-router';

const AdminUsersPosts = ({ document: user }) => 
  <ul>
    {user.posts && user.posts.map(post => 
      <li key={post._id}><Link to={Posts.getLink(post)}>{post.title}</Link></li>
    )}
  </ul>

export default AdminUsersPosts;