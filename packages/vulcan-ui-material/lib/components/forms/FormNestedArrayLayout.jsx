import React from 'react';
import PropTypes from 'prop-types';
import { instantiateComponent, replaceComponent } from 'meteor/vulcan:core';
import { intlShape } from 'meteor/vulcan:i18n';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import RemoveIcon from 'mdi-material-ui/Delete';
import AddIcon from 'mdi-material-ui/Plus';


const IconRemove = () => <RemoveIcon/>;
replaceComponent('IconRemove', IconRemove);


const IconAdd = () => <AddIcon/>;
replaceComponent('IconAdd', IconAdd);


const FormNestedArrayLayout = (props, context) => {
  const {
    hasErrors,
    nestedArrayErrors,
    label,
    hideLabel,
    addItem,
    beforeComponent,
    afterComponent,
    formComponents,
    children,
  } = props;
  const { intl } = context;
  const FormComponents = formComponents;
  
  return (
    <div className="form-nested-array-layout">
      
      {instantiateComponent(beforeComponent, props)}
      
      {
        !hideLabel &&
        
        <Typography
          component="label"
          variant="subtitle1"
          gutterBottom
        >
          {label}
        </Typography>
      }
      
      {children}
      
      {
        addItem &&
        
        <Grid container direction="column" alignItems="flex-end">
          <Fab 
            color="primary" 
            onClick={addItem} 
            className="form-nested-button" 
            aria-label={intl.formatMessage({ id: 'forms.add_nested_field' }, { label: label })}
          >
            <AddIcon/>
          </Fab>
        </Grid>
      }
      
      {
        hasErrors
          ?
          <FormComponents.FieldErrors errors={nestedArrayErrors}/>
          :
          null
      }
      
      {instantiateComponent(afterComponent, props)}
    
    </div>
  );
};


FormNestedArrayLayout.propTypes = {
  hasErrors: PropTypes.bool.isRequired,
  nestedArrayErrors: PropTypes.array,
  label: PropTypes.node,
  hideLabel: PropTypes.bool,
  addItem: PropTypes.func,
  beforeComponent: PropTypes.node,
  afterComponent: PropTypes.node,
  formComponents: PropTypes.object,
  children: PropTypes.node,
};

FormNestedArrayLayout.contextTypes = {
  intl: intlShape,
};

replaceComponent({
  name: 'FormNestedArrayLayout',
  component: FormNestedArrayLayout,
});
