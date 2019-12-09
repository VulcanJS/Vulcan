import { Components, registerComponent } from 'meteor/vulcan:lib';
import React from 'react';
import Emails from '../modules/emails/collection.js';

const Template = ({ document: email }) => (
  <a href={'/email/template/' + email.template} target="_blank" rel="noopener noreferrer">
    {email.template}
  </a>
);

const HTMLPreview = ({ document: email }) => (
  <a
    href={email.path && email.path.replace(':_id?', '').replace(':documentId?', '')}
    target="_blank"
    rel="noopener noreferrer">
    {email.path}
  </a>
);

const Test = ({ document: email, loading = false }) => (
  <Components.Button disabled={loading} onClick={this.sendTest} variant="primary">
    Send Test
  </Components.Button>
);

const EmailsDashboard = () => {
  return (
    <div className="emails">
      <h1>Emails</h1>

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
