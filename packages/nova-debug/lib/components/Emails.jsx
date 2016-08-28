import Telescope from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import Actions from "../actions.js";
import { Button } from 'react-bootstrap';
import { Messages } from "meteor/nova:core";
import NovaEmail from 'meteor/nova:email';

const Loading = Telescope.components.Loading;

class Email extends Component {

  constructor() {
    super();
    this.sendTest = this.sendTest.bind(this);
    this.state = {
      loading: false
    }
  }

  sendTest() {
    this.setState({loading: true});

    Actions.call("email.test", this.props.name, (error, result) => {
      this.setState({loading: false});
      if (error) {
        Messages.flash(error.message, "error");
      } else {
        Messages.flash(`Test email sent (“${result}”).`, "success");
      }
    });
  }

  render() {
    
    const {email, name} = this.props;

    return (
      <tr>
        <td>{name}</td>
        <td><a href={"/email/template/"+email.template} target="_blank">{email.template}</a></td>
        <td>{email.subject({})}</td>
        <td><a href={email.path.replace(":_id?", "")} target="_blank">{email.path}</a></td>
        <td>
          <div className={this.state.loading ? "test-email loading" : "test-email"}>
            <Button disabled={this.state.loading} onClick={this.sendTest} bsStyle="primary">Send Test</Button>
            {this.state.loading ? <Loading color="white"/> : null}
          </div>
        </td>
      </tr>
    )
  }
}

Email.propTypes = {
  email: React.PropTypes.object,
  name: React.PropTypes.string
}

const Emails = props => {

  const emails = NovaEmail.emails;

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
            {_.map(emails, (email, key) => <Email key={key} email={email} name={key}/>)}
          </tbody>
        </table>

      </div>
    
    </div>
  )
}

module.exports = Emails
export default Emails