import React from 'react';
import { Components, replaceComponent } from 'meteor/vulcan:lib';

const ErrorCatcherContents = ({ error, message }) => (
  <div className="error-catcher">
    <Components.Flash message={{ message, properties: { error } }} />
    <div className="error-catcher-help">
      <p>Here are some suggestions to help you fix this issue:</p>
      <ol>
        <li>
          Open your browser devtools <strong>Console</strong> tab to inspect the full error
        </li>
        <li>
          If this seems like a GraphQL-related issue, you can inspect the GraphQL request in your browser devtools <strong>Network</strong>{' '}
          tab to see what exactly is being sent to the server. You can then paste the query or mutation into{' '}
          <a href="/graphiql" target="_blank" rel="noopener noreferrer">
            GraphiQL
          </a>{' '}
          to debug it.
        </li>
      </ol>
      <p>Note: these instructions will only appear during local development.</p>
    </div>
  </div>
);

replaceComponent('ErrorCatcherContents', ErrorCatcherContents);
