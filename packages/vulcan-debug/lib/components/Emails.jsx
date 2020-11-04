import { Components, registerComponent } from 'meteor/vulcan:lib';
import React from 'react';
import Emails from '../modules/emails/collection.js';
import get from 'lodash/get';

const Template = ({ document: email }) => (
  <a href={'/email/template/' + email.template} target="_blank" rel="noopener noreferrer">
    {email.template}
  </a>
);

const HTMLPreview = ({ document: email }) => (
  <a href={email.testPath && email.testPath.replace(':_id?', '').replace(':documentId?', '')} target="_blank" rel="noopener noreferrer">
    {email.testPath}
  </a>
);

const Test = ({ document: email }) => (
  <Components.MutationButton
    label="Send Test"
    variant="primary"
    mutationOptions={{
      name: 'testEmail',
      args: { emailName: 'String' },
      fragmentName: 'EmailFragment',
    }}
    mutationArguments={{ emailName: email.name }}
    successCallback={result => {
      const email = get(result, 'data.testEmail');
      const { to, subject } = email;
      alert(`Email “${subject}” sent to ${to}`);
    }}
  />
);

const EmailsDashboard = () => {
  return (
    <div className="emails">
      <h2 className="dashboard-heading dashboard-heading-emails">Emails</h2>

      <Components.Datatable
        collection={Emails}
        columns={[
          'name',
          { name: 'template', component: Template },
          { name: 'subject' },
          {
            label: 'HTML Preview',
            component: HTMLPreview,
          },
          {
            label: 'Send Test',
            component: Test,
          },
        ]}
        showEdit={false}
        showNew={false}
        showSearch={false}
      />
      {/* <div className="emails-wrapper">

        <table className="table">
          <thead>
            <tr>
              <td>Name</td>
              <td>Template</td>
              <td>Subject</td>
              <td>HTML Preview</td>
              <td>Send Test</td>
            </tr>
          </thead>
          <tbody>
            {_.map(emails, (email, key) => <Email key={key} email={email} name={key}/>)}
          </tbody>
        </table>

      </div> */}
    </div>
  );
};

registerComponent('Emails', EmailsDashboard);

export default EmailsDashboard;
