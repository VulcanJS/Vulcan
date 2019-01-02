import React from 'react';
import PropTypes from 'prop-types';
import { Components } from 'meteor/vulcan:core';
import { registerComponent } from 'meteor/vulcan:core';
import { FormattedMessage } from 'meteor/vulcan:i18n';

const FormSubmit = ({
  submitLabel,
  cancelLabel,
  cancelCallback,
  revertLabel,
  revertCallback,
  document,
  deleteDocument,
  collectionName,
  classes,
}, {
  isChanged,
  clearForm,
}) => (
  <div className="form-submit">
    <Components.Button type="submit" variant="primary">
      {submitLabel ? submitLabel : <FormattedMessage id="forms.submit" />}
    </Components.Button>

    {cancelCallback ? (
      <a
        className="form-cancel"
        onClick={e => {
          e.preventDefault();
          cancelCallback(document);
        }}
      >
        {cancelLabel ? cancelLabel : <FormattedMessage id="forms.cancel" />}
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
      {revertLabel ? revertLabel : <FormattedMessage id="forms.revert"/>}
      </a>
    ) : null}
  
    {deleteDocument ? (
      <div>
        <hr />
        <a href="javascript:void(0)" onClick={deleteDocument} className={`delete-link ${collectionName}-delete-link`}>
          <Components.Icon name="close" /> <FormattedMessage id="forms.delete" />
        </a>
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
  classes: PropTypes.object,
};

FormSubmit.contextTypes = {
  isChanged: PropTypes.func,
  clearForm: PropTypes.func,
};


registerComponent('FormSubmit', FormSubmit);
