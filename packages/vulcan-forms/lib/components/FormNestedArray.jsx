import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { registerComponent, instantiateComponent } from 'meteor/vulcan:core';
import _omit from 'lodash/omit';

// Wraps the FormNestedItem, repeated for each object
// Allow for example to have a label per object
const FormNestedArrayInnerLayout = props => {
  const { FormComponents, label, children, addItem, beforeComponent, afterComponent } = props;
  return (
    <div className="form-nested-array-inner-layout">
      {instantiateComponent(beforeComponent, props)}
      {children}
      <FormComponents.FormNestedDivider label={label} addItem={addItem}/>
      {instantiateComponent(afterComponent, props)}
    </div>
  );
};
registerComponent({
  name: 'FormNestedArrayInnerLayout',
  component: FormNestedArrayInnerLayout,
});

class FormNestedArray extends PureComponent {
  getCurrentValue() {
    return this.props.value || [];
  }

  addItem = () => {
    const value = this.getCurrentValue();
    this.props.updateCurrentValues(
      { [`${this.props.path}.${value.length}`]: {} },
      { mode: 'merge' }
    );
  };

  removeItem = index => {
    this.props.updateCurrentValues({ [`${this.props.path}.${index}`]: null });
  };

  /*

  Go through this.context.deletedValues and see if any value matches both the current field
  and the given index (ex: if we want to know if the second address is deleted, we
  look for the presence of 'addresses.1')
  */
  isDeleted = index => {
    return this.props.deletedValues.includes(`${this.props.path}.${index}`);
  };

  computeVisibleIndex = values => {
    let currentIndex = 0;
    const visibleIndexes = values.map((subDocument, subDocumentIndx) => {
      if (this.isDeleted(subDocumentIndx)) {
        return 0;
      } else {
        currentIndex = currentIndex + 1;
        return currentIndex;
      }
    });
    return visibleIndexes;
  };

  render() {
    const value = this.getCurrentValue();
    const visibleItemIndexes = this.computeVisibleIndex(value);
    // do not pass FormNested's own value, input and inputProperties props down
    const properties = _omit(
      this.props,
      'value',
      'input',
      'inputProperties',
      'nestedInput',
      'beforeComponent',
      'afterComponent'
    );
    const {
      errors,
      path,
      formComponents,
      minCount,
      maxCount,
      arrayField,
    } = this.props;
    const FormComponents = formComponents;

    //filter out null values to calculate array length
    let arrayLength = value.filter(singleValue => {
      return typeof singleValue !== 'undefined' && singleValue !== null;
    }).length;
    properties.addItem = (!maxCount || arrayLength < maxCount) ? this.addItem : null;
    
    // only keep errors specific to the nested array (and not its subfields)
    properties.nestedArrayErrors = errors.filter(error => error.path && error.path === path);
    properties.hasErrors = !!(properties.nestedArrayErrors && properties.nestedArrayErrors.length);
    
    return (
      <FormComponents.FormNestedArrayLayout {...properties}>
        
        {value.map((subDocument, i) => {
          if (this.isDeleted(i)) return null;
          const path = `${this.props.path}.${i}`;
          const visibleItemIndex = visibleItemIndexes[i];
          return (
            <FormComponents.FormNestedArrayInnerLayout
              {...arrayField}
              key={path}
              FormComponents={FormComponents}
              addItem={this.addItem}
              itemIndex={i}
              visibleItemIndex={visibleItemIndex}
              path={path}>
              <FormComponents.FormNestedItem
                {...properties}
                itemIndex={i}
                visibleItemIndex={visibleItemIndex}
                path={path}
                removeItem={() => {
                  this.removeItem(i);
                }}
                hideRemove={!!minCount && arrayLength <= minCount}
              />
            </FormComponents.FormNestedArrayInnerLayout>
          );
        })}
      
      </FormComponents.FormNestedArrayLayout>
    );
  }
}

FormNestedArray.propTypes = {
  currentValues: PropTypes.object,
  path: PropTypes.string,
  label: PropTypes.string,
  minCount: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
  maxCount: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
  errors: PropTypes.array.isRequired,
  deletedValues: PropTypes.array.isRequired,
  formComponents: PropTypes.object.isRequired,
};

export default FormNestedArray;

registerComponent('FormNestedArray', FormNestedArray);

const IconAdd = ({ width = 24, height = 24 }) => (
  <svg width={width} height={height} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
    <path fill="currentColor" d="M448 294.2v-76.4c0-13.3-10.7-24-24-24H286.2V56c0-13.3-10.7-24-24-24h-76.4c-13.3 0-24 10.7-24 24v137.8H24c-13.3 0-24 10.7-24 24v76.4c0 13.3 10.7 24 24 24h137.8V456c0 13.3 10.7 24 24 24h76.4c13.3 0 24-10.7 24-24V318.2H424c13.3 0 24-10.7 24-24z" />
  </svg>
);

registerComponent('IconAdd', IconAdd);

const IconRemove = ({ width = 24, height = 24 }) => (
  <svg width={width} height={height} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
    <path fill="currentColor" d="M424 318.2c13.3 0 24-10.7 24-24v-76.4c0-13.3-10.7-24-24-24H24c-13.3 0-24 10.7-24 24v76.4c0 13.3 10.7 24 24 24h400z" />
  </svg>
);

registerComponent('IconRemove', IconRemove);
