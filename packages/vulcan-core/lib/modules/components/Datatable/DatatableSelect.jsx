import { registerComponent, Components } from 'meteor/vulcan:lib';
import React, { memo } from 'react';
import { intlShape } from 'meteor/vulcan:i18n';
import PropTypes from 'prop-types';

/*

DatatableSelect Component

*/
const DatatableSelect = ({ toggleItem, selectedItems, document, Components }) => {
  const value = selectedItems.includes(document._id);
  const onChange = e => {
    toggleItem(document._id);
  };
  return (
    <Components.DatatableCellLayout className="datatable-check">
      <Components.FormComponentCheckbox inputProperties={{ value, onChange }} itemProperties={{ layout: 'elementOnly' }} />
    </Components.DatatableCellLayout>
  );
};

DatatableSelect.contextTypes = {
  intl: intlShape,
};
DatatableSelect.propTypes = {
  Components: PropTypes.object.isRequired,
};
registerComponent({ name: 'DatatableSelect', component: DatatableSelect, hocs: [memo] });
