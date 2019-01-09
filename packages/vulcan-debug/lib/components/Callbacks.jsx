import React from 'react';
import { registerComponent, Components } from 'meteor/vulcan:lib';
import Callbacks from '../modules/callbacks/collection.js';

const CallbacksName = ({ document }) => 
  <strong>{document.name}</strong>;

const CallbacksDashboard = props => 
  <div className="settings">
    <Components.Datatable
      showSearch={false}
      showEdit={false}
      collection={Callbacks} 
      options={{
        fragmentName: 'CallbacksFragment'        
      }}
      columns={[
        { name: 'name', component: CallbacksName }, 
        'iterator', 
        'properties', 
        'runs', 
        'description',
        'hooks',
      ]}
    />
  </div>;

registerComponent('Callbacks', CallbacksDashboard);

export default Callbacks;