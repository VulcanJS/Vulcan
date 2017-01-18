import React from 'react';
import { getSetting, registerComponent } from 'meteor/nova:core';

const renderSetting = (field, key) => {
  return (
    <tr key={key}>
      <td><code>{key}</code></td>
      <td>{field.type && field.type.name}</td>
      <td>{field.private ? <span className="private">private</span> : getSetting(key)}</td>
      <td>{field.defaultValue && field.defaultValue.toString()}</td>
      <td>{field.form && field.form.instructions}</td>
    </tr>
  )
}

const Settings = props => {
  return (
    <div className="settings">
      <h1>Settings</h1>

      <div className="settings-wrapper">

        <table className="table">
          <thead>
            <tr>
              <td>Name</td>
              <td>Type</td>
              <td>Value</td>
              <td>Default</td>
              <td>Description</td>
            </tr>
          </thead>
          <tbody>
            {_.map(_.omit(Meteor.settings, (value, key) => key.indexOf("$") >= 0), renderSetting)}
          </tbody>
        </table>

      </div>
    
    </div>
  )
}

registerComponent('Settings', Settings);
