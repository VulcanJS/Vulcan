import React from 'react';
import {
  registerComponent,
  Components,
  ComponentsTable
} from 'meteor/vulcan:lib';

const ComponentHOCs = ({ document }) => (
  <div>
    <ul>
      {document.hocs.map((hoc, i) => (
        <li key={i}>{typeof hoc.name === 'string' ? hoc.name : hoc[0].name}</li>
      ))}
    </ul>
  </div>
);

const ComponentsDashboard = props => (
  <div className="components">
    <Components.Datatable
      showSearch={false}
      showNew={false}
      showEdit={false}
      data={Object.values(ComponentsTable)}
      columns={[
        'name',
        {
          name: 'hocs',
          component: ComponentHOCs
        }
      ]}
    />
  </div>
);

registerComponent('Components', ComponentsDashboard);
