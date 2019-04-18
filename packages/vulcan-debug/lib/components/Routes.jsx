import React from 'react';
import { registerComponent, Components, Routes } from 'meteor/vulcan:lib';
import { Link } from 'react-router-dom';

const RoutePath = ({document}) => (
  <Link to={document.path}>{document.path}</Link>
);

const RoutesDashboard = props => {
  return (
    <div className="routes">
      <Components.Datatable
        showSearch={false}
        showNew={false}
        showEdit={false}
        data={Object.values(Routes)}
        columns={[
          'name',
          {
            name: 'path',
            component: RoutePath,
          },
          'componentName',
          'layoutName'
        ]}
      />
    </div>
  );
};

registerComponent('Routes', RoutesDashboard);
