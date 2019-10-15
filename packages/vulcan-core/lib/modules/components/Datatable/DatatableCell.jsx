import { Components, registerComponent } from 'meteor/vulcan:lib';
import React from 'react';
import PropTypes from 'prop-types';

const getColumnName = column => (typeof column === 'string' ? column : column.label || column.name);

/*

DatatableCell Component

*/
const DatatableCell = ({ column, document, currentUser, Components, collection }) => {
  const Component =
    column.component ||
    (column.componentName && Components[column.componentName]) ||
    Components.DatatableDefaultCell;
  const columnName = getColumnName(column);

  return (
    <Components.DatatableCellLayout
      className={`datatable-item-${columnName.toLowerCase().replace(/\s/g, '-')}`}>
      <Component
        column={column}
        document={document}
        currentUser={currentUser}
        Components={Components}
        collection={collection}
      />
    </Components.DatatableCellLayout>
  );
};
DatatableCell.propTypes = {
  Components: PropTypes.object.isRequired,
};
registerComponent('DatatableCell', DatatableCell);

const DatatableCellLayout = ({ children, ...otherProps }) => (
  <td {...otherProps}>
    <div className="cell-contents">{children}</div>
  </td>
);
registerComponent({ name: 'DatatableCellLayout', component: DatatableCellLayout });

/*

DatatableDefaultCell Component

*/
const DatatableDefaultCell = ({ column, document, Components, collection }) => {
  const fieldName = typeof column === 'string' ? column : column.name;
  const props = { value: document[fieldName], fieldName, Components, collection };

  return <Components.CardItemSwitcher {...props} {...typeof column !== 'string' && column} />;
};
registerComponent('DatatableDefaultCell', DatatableDefaultCell);
