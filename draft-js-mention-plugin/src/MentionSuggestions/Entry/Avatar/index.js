import React from 'react';

const Avatar = ({ mention, theme = {} }) => {
  if (mention.has('avatar')) {
    return (
      <img
        src={mention.get('avatar')}
        className={theme.mentionSuggestionsEntryAvatar}
        role="presentation"
      />
    );
  }

  return null;
};

export default Avatar;
