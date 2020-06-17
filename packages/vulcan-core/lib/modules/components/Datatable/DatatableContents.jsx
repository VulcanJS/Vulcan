import { registerComponent } from 'meteor/vulcan:lib';
import React from 'react';
import { FormattedMessage } from 'meteor/vulcan:i18n';
import PropTypes from 'prop-types';
import _sortBy from 'lodash/sortBy';
import Form from 'react-bootstrap/Form';

const wrapColumns = c => ({ name: c });

const getColumns = (columns, results, data) => {
  if (columns) {
    // convert all columns to objects
    const convertedColums = columns.map(column => (typeof column === 'object' ? column : { name: column }));
    const sortedColumns = _sortBy(convertedColums, column => column.order);
    return sortedColumns;
  } else if (results && results.length > 0) {
    // if no columns are provided, default to using keys of first array item
    return Object.keys(results[0])
      .filter(k => k !== '__typename')
      .map(wrapColumns);
  } else if (data) {
    // note: withMulti HoC also passes a prop named data, but in this case
    // data should be the prop passed to the Datatable
    return Object.keys(data[0]).map(wrapColumns);
  }
  return [];
};

/*

DatatableContents Component

*/

const DatatableContents = props => {
  let {
    title,
    collection,
    datatableData,
    results = [],
    columns,
    loading,
    loadMore,
    count,
    totalCount,
    networkStatus,
    showSelect,
    showEdit,
    showDelete,
    currentUser,
    currentSelection = [],
    toggleSort,
    toggleSelection,
    currentSort,
    submitFilters,
    currentFilters,
    modalProps,
    Components,
    error,
  } = props;

  if (loading) {
    return (
      <div className="datatable-list datatable-list-loading">
        <Components.Loading />
      </div>
    );
  }

  const isLoadingMore = networkStatus === 2;
  const hasMore = results && totalCount > results.length;

  const sortedColumns = getColumns(columns, results, datatableData);

  const hasResults = results && results.length;
  const hasSelection = currentSelection && currentSelection.length;
  const isAllSelected = results.every(result => currentSelection.includes(result._id)); // TODO: would be more efficient with a map instead of an array
  // show number of selected items
  const selectedLabel = hasSelection ? `(${currentSelection.length})` : '';
  return (
    <Components.DatatableContentsLayout>
      {/* note: we want to be able to show potential errors while still showing the data below */}
      {error && <Components.Alert variant="danger">{error.message}</Components.Alert>}
      {title && <Components.DatatableTitle title={title} />}
      <Components.DatatableContentsInnerLayout>
        <Components.DatatableContentsHeadLayout>
          {showSelect ? (
            <th>
              <Form.Check
                value={isAllSelected}
                label={selectedLabel}
                disabled={!hasResults}
                checked={isAllSelected}
                //path="select"
                //variant="checkbox"
                optional
                onChange={() => {
                  if (isAllSelected) {
                    // reenable current selection
                    toggleSelection(currentSelection, true);
                  } else {
                    // select all
                    toggleSelection(results.map(o => o._id), false);
                  }
                }}
              />
            </th>
          ) : null}
          {sortedColumns.map((column, index) => (
            <Components.DatatableHeader
              Components={Components}
              key={index}
              collection={collection}
              column={column}
              toggleSort={toggleSort}
              currentSort={currentSort}
              submitFilters={submitFilters}
              currentFilters={currentFilters}
            />
          ))}
          {showEdit ? (
            <th>
              <FormattedMessage id="datatable.edit" />
            </th>
          ) : null}
          {showDelete ? (
            <th>
              <FormattedMessage id="datatable.delete" />
            </th>
          ) : null}
        </Components.DatatableContentsHeadLayout>
        <Components.DatatableContentsBodyLayout>
          {/* {showSelect && currentSelection.length ? (
            <Components.DatatableSelections
              currentSelection={currentSelection}
              toggleSelection={toggleSelection}
              totalCount={totalCount}
              Components={Components}
              showExport={showExport}
              collection={collection}
            />
          ) : null} */}
          {results && results.length ? (
            results.map((document, index) => (
              <Components.DatatableRow
                {...props}
                collection={collection}
                columns={sortedColumns}
                document={document}
                key={index}
                showEdit={showEdit}
                showDelete={showDelete}
                currentUser={currentUser}
                currentSelection={currentSelection}
                toggleSelection={toggleSelection}
                modalProps={modalProps}
              />
            ))
          ) : (
            <Components.DatatableEmpty />
          )}
        </Components.DatatableContentsBodyLayout>
      </Components.DatatableContentsInnerLayout>
      {hasMore && (
        <Components.DatatableContentsMoreLayout>
          {isLoadingMore ? (
            <Components.Loading />
          ) : (
            <Components.DatatableLoadMoreButton
              Components={Components}
              onClick={e => {
                e.preventDefault();
                loadMore();
              }}>
              Load More ({count}/{totalCount})
            </Components.DatatableLoadMoreButton>
          )}
        </Components.DatatableContentsMoreLayout>
      )}
    </Components.DatatableContentsLayout>
  );
};
DatatableContents.propTypes = {
  Components: PropTypes.object.isRequired,
  currentSelection: PropTypes.arrayOf(PropTypes.string),
};
registerComponent('DatatableContents', DatatableContents);

const DatatableContentsLayout = ({ children }) => <div className="datatable-list">{children}</div>;
registerComponent({ name: 'DatatableContentsLayout', component: DatatableContentsLayout });

const DatatableContentsInnerLayout = ({ children }) => <table className="table">{children}</table>;
registerComponent({
  name: 'DatatableContentsInnerLayout',
  component: DatatableContentsInnerLayout,
});

const DatatableContentsHeadLayout = ({ children }) => (
  <thead>
    <tr>{children}</tr>
  </thead>
);

registerComponent({ name: 'DatatableContentsHeadLayout', component: DatatableContentsHeadLayout });

const DatatableContentsBodyLayout = ({ children }) => <tbody>{children}</tbody>;

registerComponent({ name: 'DatatableContentsBodyLayout', component: DatatableContentsBodyLayout });

const DatatableContentsMoreLayout = ({ children }) => <div className="datatable-list-load-more">{children}</div>;
registerComponent({ name: 'DatatableContentsMoreLayout', component: DatatableContentsMoreLayout });

const DatatableLoadMoreButton = ({ count, totalCount, Components, children, ...otherProps }) => (
  <Components.Button variant="primary" {...otherProps}>
    {children}
  </Components.Button>
);
registerComponent({ name: 'DatatableLoadMoreButton', component: DatatableLoadMoreButton });

/*

DatatableTitle Component

*/
const DatatableTitle = ({ title }) => <div className="datatable-title">{title}</div>;

registerComponent('DatatableTitle', DatatableTitle);

/*

DatatableEmpty Component

*/
const DatatableEmpty = () => (
  <tr>
    <td colSpan="99">
      <div style={{ textAlign: 'center', padding: 10 }}>
        <FormattedMessage id="datatable.empty" defaultMessage="No items to display." />
      </div>
    </td>
  </tr>
);

registerComponent('DatatableEmpty', DatatableEmpty);
/*

DatatableSelections Component

*/
// const DatatableSelections = props => {
//   const { totalCount, currentSelection, toggleSelection, Components, showExport,collection } = props;
//   const individualElementsSelected = currentSelection.filter(o => !['all'].includes(o)).length;
//   let selectedElements = 0;
//   if (currentSelection.includes('all')) selectedElements = totalCount - individualElementsSelected;
//   else selectedElements = individualElementsSelected;

//   return (
//     <td colSpan="99">
//       <div style={{ textAlign: 'center', padding: 10 }}>
//         {selectedElements} éléments sélectionnés
//         {!currentSelection.includes('all') ? (
//           <Components.Button
//             onClick={() => {
//               toggleSelection('all');
//             }}>
//             Sélectionner tous ({totalCount})
//           </Components.Button>
//         ) : null}
//        {showExport && (
//         <Components.CSVExportButton
//           collection={collection}
//           options={{ limit:10000 }}
//           // input={input}
// $        />
//       )}

//       </div>
//     </td>
//   );
// };

// DatatableSelections.propTypes = {
//   Components: PropTypes.object.isRequired,
// };

// registerComponent('DatatableSelections', DatatableSelections);
