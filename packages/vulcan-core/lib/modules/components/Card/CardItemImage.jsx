import { registerComponent } from 'meteor/vulcan:lib';
import React from 'react';

/*

Card Item Components

*/

// Image
const CardItemImage = ({ value, force = false, Components }) => {
  const isImage =
    ['.png', '.jpg', '.gif'].indexOf(value.substr(-4)) !== -1 ||
    ['.webp', '.jpeg'].indexOf(value.substr(-5)) !== -1;
  return isImage || force ? (
    <img
      className="contents-image"
      style={{ width: '100%', minWidth: 80, maxWidth: 200, display: 'block' }}
      src={value}
      alt={value}
    />
  ) : (
    <Components.CardItemURL value={value} Components={Components} />
  );
};
registerComponent({ name: 'CardItemImage', component: CardItemImage });
