import { Components, registerComponent } from 'meteor/vulcan:lib';
import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import get from 'lodash/get';
import gql from 'graphql-tag';

const databaseObjectQuery = `
query DatabaseObjectQuery($id: String){
  getDatabaseObject(id: $id)
}
`;

const DebugDatabase = () => {
  const [id, setId] = useState('');
  const { loading, data = {} } = useQuery(gql(databaseObjectQuery), { variables: { id } });

  const inputProperties = {
    value: id,
    placeholder: 'Enter a document _id…',
    onChange: event => {
      setId(event.target.value);
    },
  };

  return (
    <div className="debug-database">
      <h1>Database</h1>
      <Components.FormComponentText inputProperties={inputProperties} />
      {loading ? (
        <Components.Loading />
      ) : (
        <div>
          <h3>{get(data, 'getDatabaseObject.collectionName')}</h3>
          <pre>
            <code>{JSON.stringify(get(data, 'getDatabaseObject.document'), '', 2)}</code>
          </pre>
        </div>
      )}
    </div>
  );
};

registerComponent('DebugDatabase', DebugDatabase);

export default DebugDatabase;
