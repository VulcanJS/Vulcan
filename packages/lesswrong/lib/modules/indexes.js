import Comments from 'meteor/vulcan:comments';
import Users from "meteor/vulcan:users";
import Posts from 'meteor/vulcan:posts';


// Recent Comments query index\
Comments._ensureIndex({'postedAt': -1, '_id': -1});

// Top Posts query index
Posts._ensureIndex({'status': -1, 'draft': -1, 'isFuture': -1, 'sticky': -1, 'score': -1, '_id': -1});
