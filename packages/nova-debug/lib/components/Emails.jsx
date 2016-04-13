import React, { PropTypes, Component } from 'react';
import Actions from "../actions.js";
import { Button } from 'react-bootstrap';
import Core from "meteor/nova:core";
const Messages = Core.Messages;

const renderEmail = (email, key) => {
  
  const sendTest = () => {
    Actions.call("testEmail", key, (error, result) => {
      if (error) {
        Messages.flash(error.message, "error");
      } else {
        Messages.flash(`Test email sent (“${result}”).`, "success");
      }
    });
  };

  return (
    <tr key={key}>
      <td>{key}</td>
      <td>{email.template}</td>
      <td>{email.subject({})}</td>
      <td><a href={email.path.replace(":_id?", "")} target="_blank">{email.path}</a></td>
      <td><Button onClick={sendTest} bsStyle="primary">Send Test</Button></td>
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