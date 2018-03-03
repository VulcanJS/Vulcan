import React from 'react';
import PropTypes from 'prop-types';
import { Components } from 'meteor/vulcan:core';
import { registerComponent } from 'meteor/vulcan:core';
import Button from 'react-bootstrap/lib/Button';
import { FormattedMessage } from 'meteor/vulcan:i18n';


const FormSubmit = ({
                      submitLabel,
                      cancelLabel,
                      cancelCallback,
                      document,
                      deleteDocument,
                      collectionName,
                      classes
                    }) => (
  <div className="form-submit">

    <hr/>
    
    <div className='row'>
      <div className='col-xs-6'>
        {
          deleteDocument
            ?
            <a href="javascript:void()" onClick={deleteDocument}
               className={`btn btn-outline-danger delete-link ${collectionName}-delete-link`}>
              <Components.Icon name="trash"/> <FormattedMessage id="forms.delete"/>
            </a>
            :
            null
        }
      </div>
      <div className='col-xs-6'>        
        {
          cancelCallback
            ?
            <a className="form-cancel" onClick={(e) => {
              e.preventDefault();
              cancelCallback(document);
            }}>{cancelLabel ? cancelLabel :
              <FormattedMessage id="forms.cancel"/>}</a>
            :
            null
        }
      
        <Button type="submit" bsStyle="primary" className="pull-right">
          {submitLabel ? submitLabel : <FormattedMessage id="forms.submit"/>}
        </Button>
      
      /div>
    </div>
  </div>
);


FormSubmit.propTypes = {
  submitLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  cancelCallback: PropTypes.func,
  document: PropTypes.object,
  deleteDocument: PropTypes.func,
  collectionName: PropTypes.string,
  classes: PropTypes.object,
};


registerComponent('FormSubmit', FormSubmit);
