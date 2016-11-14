// fragments without dependencies
import './fragments/users.js';
import './fragments/categories.js';

// fragments with dependencies
import './fragments/posts.js'; // users & categories
import './fragments/comments.js'; // users