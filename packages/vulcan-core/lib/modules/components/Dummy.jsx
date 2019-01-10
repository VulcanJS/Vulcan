import React from 'react';
import {registerComponent} from 'meteor/vulcan:lib';

function Dummy({children}) {
  return children;
}
Dummy.displayName = 'Dummy';

registerComponent({name: 'Dummy', component: Dummy});
export default Dummy;
