import { registerComponent } from 'meteor/vulcan:lib';
import React from 'react';

const VerticalMenuLayout = ({menu}) => {
  return (
    <div className="verticalMenuLayout" >
      {menu}
    </div>
  );
};


registerComponent('VerticalMenuLayout', VerticalMenuLayout);

export default VerticalMenuLayout;
