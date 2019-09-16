import { registerComponent } from 'meteor/vulcan:lib';
import React from 'react';
import { FormattedMessage } from 'meteor/vulcan:i18n';
import PropTypes from 'prop-types';
import _sortBy from 'lodash/sortBy';

/*

DatatableContents Component

*/

const DatatableContents = props => {
  let {
    title,
    collection,
    results,
    columns,
    loading,
    loadMore,
    count,
    totalCount,
    networkStatus,
    showEdit,
    currentUser,
    emptyState,
    toggleSort,
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
  } else if (!results || !results.length) {
    return emptyState || null;
  }

  // if no columns are provided, default to using keys of first array item
  if (!columns) {
    columns = Object.keys(results[0]);
  }

  const isLoadingMore = networkStatus === 2;
  const hasMore = totalCount > results.length;
  const sortedColumns = _sortBy(columns, column => column.order);
  return (
    <Components.DatatableContentsLayout>
      {/* note: we want to be able to show potential errors while still showing the data below */}
      {error && <Components.Alert variant="danger">{error.message}</Components.Alert>}
      {title && <Components.DatatableTitle title={title} />}
      <Components.DatatableContentsInnerLayout>
        <Components.DatatableContentsHeadLayout>
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
        </Components.DatatableContentsHeadLayout>
        <Components.DatatableContentsBodyLayout>
          {results.map((document, index) => (
            <Components.DatatableRow
              {...props}
              collection={collection}
              columns={columns}
              document={document}
              key={index}
              showEdit={showEdit}
              currentUser={currentUser}
              modalProps={modalProps}
            />
          ))}
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

const DatatableContentsMoreLayout = ({ children }) => (
  <div className="datatable-list-load-more">{children}</div>
);

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
