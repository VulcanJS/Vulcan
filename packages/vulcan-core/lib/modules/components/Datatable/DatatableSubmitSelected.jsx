import { registerComponent, Components } from 'meteor/vulcan:lib';
import React, { memo } from 'react';
import PropTypes from 'prop-types';

/*

DatatableSelect Component

*/
const DatatableSubmitSelected = ({ selectedItems, onSubmitSelected }) => (
  <Components.Button
    className="datatable-submit-selected"
    onClick={e => {
      e.preventDefault();
      onSubmitSelected(selectedItems);
    }}>
    <Components.FormattedMessage id="datatable.submit" />
  </Components.Button>
);

registerComponent({ name: 'DatatableSubmitSelected', component: DatatableSubmitSelected, hocs: [memo] });
