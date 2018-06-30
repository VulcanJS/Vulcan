import React from 'react';
import PropTypes from 'prop-types';
import { registerComponent, Components } from 'meteor/vulcan:core';

const FormErrors = ({ errors }) => (
  <div className="form-errors">
    {!!errors.length && (
      <Components.Alert className="flash-message" variant="danger">
        <ul>
          {errors.map((error, index) => (
            <li key={index}>
              <Components.FormError error={error} errorContext="form" />
            </li>
          ))}
        </ul>
      </Components.Alert>
    )}
  </div>
);
registerComponent('FormErrors', FormErrors);

// /*

//   Render errors

//   */
//  renderErrors = () => {
//   return (
//     <div className="form-errors">
//       {this.state.errors.map((error, index) => {
//         let message;

//         if (error.data && error.data.errors) {
//           // this error is a "multi-error" with multiple sub-errors

//           message = error.data.errors.map(error => {
//             return {
//               content: this.getErrorMessage(error),
//               data: error.data,
//             };
//           });
//         } else {
//           // this is a regular error

//           message = {
//             content:
//               error.message ||
//               this.context.intl.formatMessage({ id: error.id, defaultMessage: error.id }, error.data),
//           };
//         }

//         return <Components.FormFlash key={index} message={message} type="error" />;
//       })}
//     </div>
//   );
// };
