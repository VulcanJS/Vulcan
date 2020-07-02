import { Components, registerComponent } from 'meteor/vulcan:lib';
import React, { memo } from 'react';
import PropTypes from 'prop-types';

/*

DatatableCell Component

*/
const DatatableCell = ({ column, document, currentUser, Components, collection }) => {
  const Component = column.component || (column.componentName && Components[column.componentName]) || Components.DatatableDefaultCell;
  const columnName = column.label || column.name;

  return (
    <Components.DatatableCellLayout className={`datatable-item-${columnName.toLowerCase().replace(/\s/g, '-')}`}>
      <Component column={column} document={document} currentUser={currentUser} Components={Components} collection={collection} />
    </Components.DatatableCellLayout>
  );
};
DatatableCell.propTypes = {
  Components: PropTypes.object.isRequired,
};
registerComponent({ name: 'DatatableCell', component: DatatableCell, hocs: [memo] });

const DatatableCellLayout = ({ children, ...otherProps }) => (
  <td {...otherProps}>
    <div className="cell-contents">{children}</div>
  </td>
);
registerComponent({ name: 'DatatableCellLayout', component: DatatableCellLayout, hocs: [memo] });

/*

DatatableDefaultCell Component

*/
const DatatableDefaultCell = ({ column, document, ...rest }) => (
  <Components.CardItemSwitcher value={document[column.name]} document={document} fieldName={column.name} {...column} {...rest} />
);

registerComponent({ name: 'DatatableDefaultCell', component: DatatableDefaultCell, hocs: [memo] });
