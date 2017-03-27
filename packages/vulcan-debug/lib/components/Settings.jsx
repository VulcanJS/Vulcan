import React from 'react';
import { FormattedMessage } from 'react-intl';
import { getSetting, registerComponent, Components } from 'meteor/vulcan:core';

const renderSetting = key => (
  <tr key={key}>
    <td><code>{key}</code></td>
    <td>{JSON.stringify(getSetting(key))}</td>
  </tr>
);

const Settings = props => {
  
  const publicSettings = Meteor.settings.public;
  
  return (
    <Components.ShowIf check={user => user && user.isAdmin} failureComponent={<FormattedMessage id="app.noPermission" />}>
      <div className="settings">
      
        <h1>Public settings</h1>
        
        <div>To access your private settings, have a look at your <code>settings.json</code> file.</div>
        
        <div>More info about settings <a href="http://docs.vulcanjs.org/settings.html">in the docs</a></div>
        
        <div className="settings-wrapper">

          <table className="table">
            <thead>
              <tr>
                <td>Name</td>
                <td>Value</td>
              </tr>
            </thead>
            <tbody>
              {Object.keys(publicSettings).filter(key => !Array.isArray(publicSettings[key])).map(renderSetting)}
            </tbody>
          </table>

        </div>
      </div>
    </Components.ShowIf>
  );
}

registerComponent('Settings', Settings);
