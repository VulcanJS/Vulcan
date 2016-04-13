import React from 'react';
import Actions from "../actions.js";
import { Button } from 'react-bootstrap';

const sendTest = event => {
  const email = this;
  Actions.call("testEmail", email)
}

const renderEmail = (email, key) => {
  const testEmail = sendTest.bind(this);
  return (
    <tr key={key}>
      <td>{key}</td>
      <td>{email.template}</td>
      <td>{email.subject({})}</td>
      <td><a href={email.path.replace(":_id?", "")} target="_blank">{email.path}</a></td>
      <td><Button onClick={testEmail} bsStyle="primary">Send Test</Button></td>
    </tr>
  )
}

const Emails = props => {

  const emails = Telescope.email.emails;

  return (
    <div className="emails">
      <h1>Emails</h1>

      <div className="emails-wrapper">

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
            {_.map(emails,renderEmail)}
          </tbody>
        </table>

      </div>
    
    </div>
  )
}

module.exports = Emails
export default Emails