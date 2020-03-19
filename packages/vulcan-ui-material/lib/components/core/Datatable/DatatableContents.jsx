import React from 'react';
import {
  Components,
  replaceComponent,
} from 'meteor/vulcan:core';
import withStyles from '@material-ui/core/styles/withStyles';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import _assign from 'lodash/assign';
import _sortBy from 'lodash/sortBy';
import classNames from 'classnames';
import { baseStyles } from './Datatable'

/*

DatatableContents Component

*/

const wrapColumns = c => ({ name: c });

const getColumns = (columns, results, data) => {
  if (columns) {
    // convert all columns to objects
    const convertedColums = columns.map(column =>
      typeof column === 'object' ? column : { name: column }
    );
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

const datatableContentsStyles = theme =>
  _assign({}, baseStyles(theme), {
    table: {
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(3),
    },
    denseTable: theme.utils.denseTable,
    flatTable: theme.utils.flatTable,
    denserTable: theme.utils.denserTable,
  });

const DatatableContents = ({
  collection,
  error,
  columns,
  results,
  loading,
  loadMore,
  count,
  totalCount,
  networkStatus,
  refetch,
  showEdit,
  editComponent,
  emptyState,
  currentUser,
  classes,
  footerData,
  dense,
  queryDataRef,
  rowClass,
  handleRowClick,
  intlNamespace,
  title,
  toggleSort,
  currentSort,
  paginate,
  paginationTerms,
  setPaginationTerms,
}) => {
  if (loading) {
    return <Components.Loading />;
  } else if (!results || !results.length) {
    return emptyState || null;
  }

  if (queryDataRef) queryDataRef(this.props);
  let sortedColumns = getColumns(columns, results);
  
  const denseClass = dense && classes[dense + 'Table'];

  // Pagination functions
  const getPage = paginationTerms =>
    parseInt((paginationTerms.limit - 1) / paginationTerms.itemsPerPage);

  const onChangePage = (event, page) => {
    setPaginationTerms({
      itemsPerPage: paginationTerms.itemsPerPage,
      limit: (page + 1) * paginationTerms.itemsPerPage,
      offset: page * paginationTerms.itemsPerPage,
    });
  };

  const onChangeRowsPerPage = event => {
    let value = event.target.value;
    let offset = Math.max(
      0,
      parseInt((paginationTerms.limit - paginationTerms.itemsPerPage) / value) * value
    );
    let limit = Math.min(offset + value, totalCount);
    setPaginationTerms({
      itemsPerPage: value,
      limit: limit,
      offset: offset,
    });
  };

  return (
    <React.Fragment>
      {error && <Components.Alert variant="danger">{error.message}</Components.Alert>}
      {title && <Components.DatatableTitle title={title} />}
      <Components.DatatableContentsInnerLayout className={classNames(classes.table, denseClass)}>
        {sortedColumns && (
          <TableHead className={classes.tableHead}>
            <TableRow className={classes.tableRow}>
              {_sortBy(sortedColumns, column => column.order).map((column, index) => (
                <Components.DatatableHeader
                  key={index}
                  collection={collection}
                  intlNamespace={intlNamespace}
                  column={column}
                  classes={classes}
                  toggleSort={toggleSort}
                  currentSort={currentSort}
                />
              ))}
              {(showEdit || editComponent) && <TableCell className={classes.tableCell} />}
            </TableRow>
          </TableHead>
        )}

        {results && (
          <TableBody className={classes.tableBody}>
            {results.map((document, index) => (
              <Components.DatatableRow
                collection={collection}
                columns={sortedColumns}
                document={document}
                refetch={refetch}
                key={index}
                showEdit={showEdit}
                editComponent={editComponent}
                currentUser={currentUser}
                classes={classes}
                rowClass={rowClass}
                handleRowClick={handleRowClick}
              />
            ))}
          </TableBody>
        )}

        {footerData && (
          <TableFooter className={classes.tableFooter}>
            <TableRow className={classes.tableRow}>
              {_sortBy(columns, column => column.order).map((column, index) => (
                <TableCell
                  key={index}
                  className={classNames(classes.tableCell, column.footerClass)}>
                  {footerData[index]}
                </TableCell>
              ))}
              {(showEdit || editComponent) && <TableCell className={classes.tableCell} />}
            </TableRow>
          </TableFooter>
        )}
      </Components.DatatableContentsInnerLayout>
      {paginate && (
        <TablePagination
          component="div"
          count={totalCount}
          rowsPerPage={paginationTerms.itemsPerPage}
          page={getPage(paginationTerms)}
          backIconButtonProps={{
            'aria-label': 'Previous Page',
          }}
          nextIconButtonProps={{
            'aria-label': 'Next Page',
          }}
          onChangePage={onChangePage}
          onChangeRowsPerPage={onChangeRowsPerPage}
        />
      )}
      {!paginate && loadMore && (
        <Components.LoadMore
          className={classes.loadMore}
          count={count}
          totalCount={totalCount}
          loadMore={loadMore}
          networkStatus={networkStatus}
        />
      )}
    </React.Fragment>
  );
};

replaceComponent('DatatableContents', DatatableContents, [withStyles, datatableContentsStyles]);

