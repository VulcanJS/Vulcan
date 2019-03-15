import React from 'react';
import PropTypes from 'prop-types';
import { Components, registerComponent } from 'meteor/vulcan:core';
import { intlShape } from 'meteor/vulcan:i18n';
import EditIcon from 'mdi-material-ui/Pencil';


const EditButton = ({
                      collection,
                      document,
                      color = 'default',
                      variant,
                      triggerClasses,
                      buttonClasses,
                      ...props
                    }, { intl }) => (
  
  <Components.ModalTrigger
    classes={triggerClasses}
    component={<Components.TooltipIconButton titleId="datatable.edit"
                                             icon={<EditIcon/>}
                                             color={color}
                                             variant={variant}
                                             classes={buttonClasses}
    />}
  >
    <Components.EditForm collection={collection} document={document} {...props}/>
  </Components.ModalTrigger>
);


EditButton.propTypes = {
  collection: PropTypes.object.isRequired,
  document: PropTypes.object.isRequired,
  color: PropTypes.oneOf(['default', 'inherit', 'primary', 'secondary']),
  variant: PropTypes.string,
  triggerClasses: PropTypes.object,
  buttonClasses: PropTypes.object,
};


EditButton.contextTypes = {
  intl: intlShape
};


EditButton.displayName = 'EditButton';


registerComponent('EditButton', EditButton);


/*

EditForm Component

*/
const EditForm = ({ collection, document, closeModal, options, successCallback, removeSuccessCallback,...props }) => {
  
  const success = successCallback
    ? () => {
        successCallback();
        closeModal();
      }
    : closeModal;

  const remove = removeSuccessCallback
    ? () => {
        removeSuccessCallback();
        closeModal();
      }
    : closeModal;
  
  return (
  <Components.SmartForm
    {...props}
    collection={collection}
    documentId={document && document._id}
    showRemove={true}
    successCallback={success}
    removeSuccessCallback={remove}
  />
);
}

registerComponent('EditForm', EditForm);
