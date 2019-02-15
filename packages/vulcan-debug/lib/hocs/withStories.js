import React from 'react';

import { runCallbacks } from 'meteor/vulcan:lib';

export default C => {
  const stories = runCallbacks({ name: 'stories.register', iterator: [] /* properties: {} */ });
  const WithStories = props => <C {...props} stories={stories} />;
  return WithStories;
};
