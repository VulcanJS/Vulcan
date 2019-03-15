import React from 'react';
import PropTypes from 'prop-types';
import { Components, replaceComponent } from 'meteor/vulcan:core';
import { intlShape } from 'meteor/vulcan:i18n';
import AddIcon from 'mdi-material-ui/Plus';


const NewButton = ({
                     className,
                     collection,
                     color = 'default',
                     variant,
                   }, { intl }) => (
  
  <Components.ModalTrigger
    className={className}
    component={<Components.TooltipIconButton titleId="datatable.new"
                                             icon={<AddIcon/>}
                                             color={color}
                                             variant={variant}
    />}
  >
    <Components.EditForm collection={collection}/>
  </Components.ModalTrigger>
);


NewButton.propTypes = {
  className: PropTypes.string,
  collection: PropTypes.object.isRequired,
  color: PropTypes.oneOf(['default', 'inherit', 'primary', 'secondary']),
  variant: PropTypes.string,
};


NewButton.contextTypes = {
  intl: intlShape
};


NewButton.displayName = 'NewButton';


replaceComponent('NewButton', NewButton);
