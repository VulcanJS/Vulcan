import { makeVoteable } from 'meteor/vulcan:voting';
import { Posts } from './posts/index.js';
import { Comments } from './comments/index.js';

makeVoteable(Posts);
makeVoteable(Comments);