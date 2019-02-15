import { registerCallback } from 'meteor/vulcan:lib';

registerCallback({
  name: 'stories.register', 
  description: 'Add stories to VulcanBook',  
  iterator: {stories: 'Currently defined stories'},
  // properties: [{}],
  runs: 'sync', 
  returns: 'stories',
});