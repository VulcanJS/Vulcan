import React from 'react';

import { Components, addCallback } from 'meteor/vulcan:lib';
import Callbacks from '../callbacks/collection';

const defaultProps = {
  Datatable: {},
};

const coreStories = [
  {
    group: 'core/DataTable',
    name: 'Datatable with static data',
    render: () => (
      <Components.Datatable
        {...defaultProps.Datatable}
        data={[{ col1: 'value1.1', col2: 42 }, { col1: 'value1.2', col2: 43 }]}
      />
    ),
  },
  {
    group: 'core/DataTable',
    name: 'Datatable with dynamic data',
    render: () => (
      <Components.Datatable
        collection={Callbacks}
        options={{
          fragmentName: 'CallbacksFragment',
          limit: 3,
        }}
        columns={['name', 'iterator', 'properties', 'description', 'hooks']}
      />
    ),
  },
];
addCallback('stories.register', (stories = []) => [...stories, ...coreStories]);
