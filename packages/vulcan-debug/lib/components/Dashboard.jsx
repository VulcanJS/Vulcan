import React from 'react';
import { registerComponent } from 'meteor/vulcan:lib';
import { Link } from 'react-router-dom';

function Dashboard() {
  return (
    <div>
      <h3>Debug Dashboard</h3>
      <ul>
        <li key="Callbacks">
          <Link to="/debug/callbacks">Callbacks</Link>
        </li>
        <li key="Components">
          <Link to="/debug/components">Components</Link>
        </li>
        <li key="Emails">
          <Link to="/debug/emails">Emails</Link>
        </li>
        <li key="Groups">
          <Link to="/debug/groups">Groups</Link>
        </li>
        <li key="I18n">
          <Link to="/debug/i18n">I18n</Link>
        </li>
        <li key="Routes">
          <Link to="/debug/routes">Routes</Link>
        </li>
        <li key="Settings">
          <Link to="/debug/settings">Settings</Link>
        </li>
      </ul>
    </div>
  );
}

registerComponent({ name: 'DebugDashboard', component: Dashboard, hocs: [] });
