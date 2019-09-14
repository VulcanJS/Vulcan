import { Components, registerComponent } from 'meteor/vulcan:lib';
import React from 'react';
import PropTypes from 'prop-types';

import { getFieldValue } from '../Card.jsx';

const getColumnName = column => (typeof column === 'string' ? column : column.label || column.name);

/*

DatatableCell Component

*/
const DatatableCell = ({ column, document, currentUser, Components }) => {
  const Component =
    column.component ||
    (column.componentName && Components[column.componentName]) ||
    Components.DatatableDefaultCell;
  const columnName = getColumnName(column);
  return (
    <Components.DatatableCellLayout
      className={`datatable-item-${columnName.toLowerCase().replace(/\s/g, '-')}`}>
      <Component column={column} document={document} currentUser={currentUser} />
    </Components.DatatableCellLayout>
  );
};
DatatableCell.propTypes = {
  Components: PropTypes.object.isRequired,
};
registerComponent('DatatableCell', DatatableCell);

const DatatableCellLayout = ({ children, ...otherProps }) => <td {...otherProps}>{children}</td>;
registerComponent({ name: 'DatatableCellLayout', component: DatatableCellLayout });

/*

DatatableDefaultCell Component

*/
const DatatableDefaultCell = ({ column, document }) => (
  <div>
    {typeof column === 'string'
      ? getFieldValue(document[column])
      : getFieldValue(document[column.name], column)}
  </div>
);

registerComponent('DatatableDefaultCell', DatatableDefaultCell);
