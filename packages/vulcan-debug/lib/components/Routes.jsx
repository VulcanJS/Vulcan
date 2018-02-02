import React from 'react';
import { registerComponent, Components, Routes } from 'meteor/vulcan:lib';
import { Link } from 'react-router';

console.log(Object.values(Routes))

const RoutePath = ({ document }) => 
  <Link to={document.path}>{document.path}</Link>

const RoutesDashboard = props => 
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
          component: RoutePath
        }, 
        'componentName', 
      ]}
    />
  </div>

registerComponent('Routes', RoutesDashboard);