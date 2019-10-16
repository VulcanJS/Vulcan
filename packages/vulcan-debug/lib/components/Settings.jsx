import React from 'react';
import { registerComponent, Components } from 'meteor/vulcan:lib';
import Settings from '../modules/settings/collection.js';

const ObjectAsStr = ({ document, column: { name } }) => {
  const value = document[name];
  return typeof value === 'string' ? value : JSON.stringify(value);
};
const SettingName = ({ document }) => <strong>{document.name}</strong>;

const SettingsDashboard = props => (
  <div className="settings">
    <Components.Datatable
      showSearch={false}
      showEdit={false}
      collection={Settings}
      columns={[
        { name: 'name', component: SettingName },
        { name: 'value', component: ObjectAsStr },
        { name: 'defaultValue', component: ObjectAsStr },
        'isPublic',
        'description',
        'serverOnly',
      ]}
    />
  </div>
);

registerComponent('Settings', SettingsDashboard);

export default Settings;
