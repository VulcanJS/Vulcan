import React from 'react';

const renderEmail = (email, key) => {
  return (
    <tr key={key}>
      <td>{email.name}</td>
      <td><a href={email.path.replace(":_id?", "")} target="_blank">{email.path}</a></td>
      <td>coming soon…</td>
    </tr>
  )
}

const Emails = props => {

  const emailRoutes = Telescope.email.routes;

  return (
    <div className="emails">
      <h1>Emails</h1>

      <div className="emails-wrapper">

        <table className="table">
          <thead>
            <tr>
              <td>Name</td>
              <td>Preview</td>
              <td>Send Test</td>
            </tr>
          </thead>
          <tbody>
            {emailRoutes.map(renderEmail)}
          </tbody>
        </table>

      </div>
    
    </div>
  )
}

module.exports = Emails
export default Emails