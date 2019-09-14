import { Components, registerComponent } from 'meteor/vulcan:lib';
import React from 'react';
import _isFunction from 'lodash/isFunction';
import _sortBy from 'lodash/sortBy';
import PropTypes from 'prop-types';
import { intlShape } from 'meteor/vulcan:i18n';

/*

DatatableRow Component

*/
const DatatableRow = (props, { intl }) => {
  const {
    collection,
    columns,
    document,
    showEdit,
    currentUser,
    options,
    editFormOptions,
    rowClass,
    Components,
  } = props;
  // openCRUD backwards compatibility
  const canEdit =
    collection &&
    collection.options &&
    collection.options.mutations &&
    collection.options.mutations.edit &&
    collection.options.mutations.edit.check(currentUser, document);
  const canUpdate =
    collection &&
    collection.options &&
    collection.options.mutations &&
    collection.options.mutations.update &&
    collection.options.mutations.update.check(currentUser, document);
  const row = typeof rowClass === 'function' ? rowClass(document) : rowClass || '';
  const { modalProps = {} } = props;
  const defaultModalProps = { title: <code>{document._id}</code> };
  const customModalProps = {
    ...defaultModalProps,
    ...(_isFunction(modalProps) ? modalProps(document) : modalProps),
  };
  const sortedColumns = _sortBy(columns, column => column.order);

  return (
    <Components.DatatableRowLayout className={`datatable-item ${row}`}>
      {sortedColumns.map((column, index) => (
        <Components.DatatableCell
          key={index}
          Components={Components}
          column={column}
          document={document}
          currentUser={currentUser}
        />
      ))}
      {showEdit && (canEdit || canUpdate) ? ( // openCRUD backwards compatibility
        <Components.DatatableCellLayout>
          <Components.EditButton
            collection={collection}
            documentId={document._id}
            currentUser={currentUser}
            mutationFragmentName={options && options.fragmentName}
            modalProps={customModalProps}
            {...editFormOptions}
          />
        </Components.DatatableCellLayout>
      ) : null}
    </Components.DatatableRowLayout>
  );
};
DatatableRow.propTypes = {
  Components: PropTypes.object.isRequired,
};
registerComponent('DatatableRow', DatatableRow);

DatatableRow.contextTypes = {
  intl: intlShape,
};
const DatatableRowLayout = ({ children, ...otherProps }) => <tr {...otherProps}>{children}</tr>;
registerComponent({ name: 'DatatableRowLayout', component: DatatableRowLayout });
