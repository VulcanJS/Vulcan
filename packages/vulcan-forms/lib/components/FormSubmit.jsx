import React from 'react';
import PropTypes from 'prop-types';
import { Components } from 'meteor/vulcan:core';
import { registerComponent } from 'meteor/vulcan:core';
import Users from 'meteor/vulcan:users';

const FormSubmit = ({
  submitForm,
  submitLabel,
  cancelLabel,
  cancelCallback,
  revertLabel,
  revertCallback,
  document,
  deleteDocument,
  collectionName,
  classes,
  currentUser,
}, {
  isChanged,
  clearForm,
}) => (
  <div className="form-submit">
    <Components.Button type="submit" variant="primary">
      {submitLabel ? submitLabel : <Components.FormattedMessage id="forms.submit" defaultMessage="Submit" />}
    </Components.Button>

    {cancelCallback ? (
      <a
        className="form-cancel"
        onClick={e => {
          e.preventDefault();
          cancelCallback(document);
        }}
      >
        {cancelLabel ? cancelLabel : <Components.FormattedMessage id="forms.cancel" defaultMessage="Cancel" />}
      </a>
    ) : null}
  
    {revertCallback ? (
      <a
        className="form-cancel"
        onClick={e => {
          e.preventDefault();
          clearForm();
          revertCallback(document);
        }}
      >
      {revertLabel ? revertLabel : <Components.FormattedMessage id="forms.revert" defaultMessage="Revert" />}
      </a>
    ) : null}
  
    { deleteDocument && Users.canDelete({
        user: currentUser,
        document,
        collectionName
      }) ? (
      <div>
        <hr />
        <Components.Button variant="link" onClick={deleteDocument} className={`delete-link ${collectionName}-delete-link`}>
          <Components.Icon name="close" /> <Components.FormattedMessage id="forms.delete" defaultMessage="Delete" />
        </Components.Button>
      </div>
    ) : null}
  </div>
);

FormSubmit.propTypes = {
  submitLabel: PropTypes.node,
  cancelLabel: PropTypes.node,
  cancelCallback: PropTypes.func,
  revertLabel: PropTypes.node,
  revertCallback: PropTypes.func,
  document: PropTypes.object,
  deleteDocument: PropTypes.func,
  collectionName: PropTypes.string,
  classes: PropTypes.object
};

FormSubmit.contextTypes = {
  isChanged: PropTypes.func,
  clearForm: PropTypes.func,
};


registerComponent('FormSubmit', FormSubmit);
