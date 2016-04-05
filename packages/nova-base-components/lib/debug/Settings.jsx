import React from 'react';
import NovaForm from "meteor/nova:forms";

const renderSetting = (field, key) => {
  return (
    <tr key={key}>
      <td><code>{key}</code></td>
      <td>{field.type && field.type.name}</td>
      <td>{field.private ? <span className="private">private</span> : Telescope.settings.get(key)}</td>
      <td>{field.defaultValue && field.defaultValue.toString()}</td>
      <td>{field.autoform && field.autoform.instructions}</td>
    </tr>
  )
}

const Settings = props => {

  return (
    <div className="settings">
      <h1>Settings</h1>

        <NovaForm
            currentUser={Meteor.users}
            collection={Telescope.settings.collection}
            labelFunction={(fieldName)=>Telescope.utils.getFieldLabel(fieldName, Telescope.settings.collection.simpleSchema()._schema)}
        />

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
            {_.map(Telescope.settings.collection.simpleSchema()._schema, renderSetting)}
          </tbody>
        </table>

      </div>
    
    </div>
  )
}

module.exports = Settings
export default Settings