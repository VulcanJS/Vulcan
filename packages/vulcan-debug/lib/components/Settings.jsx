import React from 'react';
import { FormattedMessage } from 'meteor/vulcan:i18n';
import { registerComponent, Components } from 'meteor/vulcan:lib';
import Settings from '../modules/settings/collection.js';

const SettingName = ({ document }) => 
  <strong>{document.name}</strong>

const SettingsDashboard = props => 
  <div className="settings">
    <Components.Datatable
      showSearch={false}
      showEdit={false}
      collection={Settings} 
      columns={[
        { name: 'name', component: SettingName }, 
        'value', 
        'defaultValue', 
        'public', 
        'description'
      ]}
    />
  </div>

registerComponent('Settings', SettingsDashboard);

export default Settings;