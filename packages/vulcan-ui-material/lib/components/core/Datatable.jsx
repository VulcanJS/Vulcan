import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  Components,
  replaceComponent,
  withCurrentUser,
  withMulti,
  Utils
} from 'meteor/vulcan:core';
import { intlShape } from 'meteor/vulcan:i18n';
import withStyles from '@material-ui/core/styles/withStyles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import Tooltip from '@material-ui/core/Tooltip';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import TablePagination from '@material-ui/core/TablePagination';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { getFieldValue } from './Card';
import _assign from 'lodash/assign';
import classNames from 'classnames';


/*

Datatable Component

*/
const baseStyles = theme => ({
  root: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  searchWrapper: {
  },
  addButtonWrapper: {
  },
  addButton: {
    // Floating button won't work with multiple datatables, buttons are superposed
    // top: '9.5rem',
    // right: '2rem',
    // position: 'fixed',
    // bottom: 'auto',
  },
  table: {
    marginTop: 0
  },
  denseTable: {},
  denserTable: {},
  flatTable: {},
  tableHead: {},
  tableBody: {},
  tableFooter: {},
  tableRow: {},
  tableHeadCell: {},
  tableCell: {},
  clickRow: {},
  editCell: {},
  editButton: {}
});

const delay = (function () {
  var timer = 0;
  return function (callback, ms) {
    clearTimeout(timer);
    timer = setTimeout(callback, ms);
  };
})();

class Datatable extends PureComponent {

  constructor(props) {
    super(props);

    this.updateQuery = this.updateQuery.bind(this);

    this.state = {
      value: '',
      query: '',
      currentSort: {},
    };
  }

  toggleSort = column => {
    let currentSort;
    if (!this.state.currentSort[column]) {
      currentSort = { [column]: 1 };
    } else if (this.state.currentSort[column] === 1) {
      currentSort = { [column]: -1 };
    } else {
      currentSort = {};
    }
    this.setState({ currentSort });
  };

  updateQuery(value) {
    this.setState({
      value: value
    });
    delay(() => {
      this.setState({
        query: value
      });
    }, 700);
  }

  render() {
    if (this.props.data) {

      return <Components.DatatableContents
        columns={this.props.data.length ? Object.keys(this.props.data[0]) : undefined}
        {...this.props}
        results={this.props.data}
        count={this.props.data.length}
        totalCount={this.props.data.length}
        showEdit={false}
        showNew={false}
      />;

    } else {

      const {
        className,
        collection,
        options,
        showSearch,
        showNew,
        classes,
      } = this.props;

      const listOptions = {
        collection: collection,
        ...options,
      };

      const DatatableWithMulti = withMulti(listOptions)(Components.DatatableContents);

      // add _id to orderBy when we want to sort a column, to avoid breaking the graphql() hoc;
      // see https://github.com/VulcanJS/Vulcan/issues/2090#issuecomment-433860782
      // this.state.currentSort !== {} is always false, even when console.log(this.state.currentSort) displays
      // {}. So we test on the length of keys for this object.
      const orderBy = Object.keys(this.state.currentSort).length == 0 ? {} :
        { ...this.state.currentSort, _id: -1 };

      return (
        <div className={classNames('datatable', `datatable-${collection._name}`, classes.root,
          className)}>
          {/* DatatableAbove Component part*/}
          {(showSearch || showNew) &&
            <div className={classes.header}>
              {
                showSearch &&
                <div className={classes.searchWrapper} >
                  <Components.SearchInput value={this.state.query}
                    updateQuery={this.updateQuery}
                    className={classes.search}
                    labelId={'datatable.search'}
                  />
                </div>
              }
              {
                showNew &&
                <div className={classes.addButtonWrapper}>


                  <Components.NewButton collection={collection}
                    variant="fab"
                    color="primary"
                    className={classes.addButton}
                  />
                </div>
              }
            </div>
          }

          <DatatableWithMulti {...this.props}
            collection={collection}
            terms={{ query: this.state.query, orderBy: orderBy }}
            currentUser={this.props.currentUser}
            toggleSort={this.toggleSort}
            currentSort={this.state.currentSort}
          />
        </div>
      );
    }
  }
}


Datatable.propTypes = {
  title: PropTypes.string,
  className: PropTypes.string,
  collection: PropTypes.object,
  options: PropTypes.object,
  columns: PropTypes.array,
  showEdit: PropTypes.bool,
  editComponent: PropTypes.func,
  showNew: PropTypes.bool,
  showSearch: PropTypes.bool,
  emptyState: PropTypes.node,
  currentUser: PropTypes.object,
  classes: PropTypes.object,
  data: PropTypes.array,
  footerData: PropTypes.array,
  dense: PropTypes.string,
  queryDataRef: PropTypes.func,
  rowClass: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  handleRowClick: PropTypes.func,
  intlNamespace: PropTypes.string,
  toggleSort: PropTypes.func,
  currentSort: PropTypes.object,
  paginate: PropTypes.bool,
};


Datatable.defaultProps = {
  showNew: true,
  showEdit: true,
  showSearch: true,
  paginate: false,
};


replaceComponent('Datatable', Datatable, withCurrentUser, [withStyles, baseStyles]);


/*

DatatableContents Component

*/
const datatableContentsStyles = theme => (_assign({}, baseStyles(theme), {
  table: {
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 3,
  },
  denseTable: theme.utils.denseTable,
  flatTable: theme.utils.flatTable,
  denserTable: theme.utils.denserTable,
}));


const DatatableContents = ({
  collection,
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
  setPaginationTerms
}) => {

  if (loading) {
    return <Components.Loading />;
  } else if (!results || !results.length) {
    return emptyState || null;
  }

  if (queryDataRef) queryDataRef(this.props);

  const denseClass = dense && classes[dense + 'Table'];

  // Pagination functions
  const getPage = (paginationTerms) => (parseInt((paginationTerms.limit - 1) / paginationTerms.itemsPerPage));

  const onChangePage = (event, page) => {
    setPaginationTerms({
      itemsPerPage: paginationTerms.itemsPerPage,
      limit: (page + 1) * paginationTerms.itemsPerPage,
      offset: page * paginationTerms.itemsPerPage
    });
  };

  const onChangeRowsPerPage = (event) => {
    let value = event.target.value;
    let offset = Math.max(0, parseInt((paginationTerms.limit - paginationTerms.itemsPerPage) / value) * value);
    let limit = Math.min(offset + value, totalCount);
    setPaginationTerms({
      itemsPerPage: value,
      limit: limit,
      offset: offset
    });
  };

  return (
    <React.Fragment>
      {
        (title) ?
          <Toolbar>
            <Typography variant="h6" id="tableTitle">
              title
            </Typography>
          </Toolbar>
          : null
      }
      <Table className={classNames(classes.table, denseClass)}>
        {
          columns &&
          <TableHead className={classes.tableHead}>
            <TableRow className={classes.tableRow}>
              {
                _.sortBy(columns, column => column.order).map(
                  (column, index) =>
                    <Components.DatatableHeader key={index}
                      collection={collection}
                      intlNamespace={intlNamespace}
                      column={column}
                      classes={classes}
                      toggleSort={toggleSort}
                      currentSort={currentSort}
                    />
                )
              }
              {
                (showEdit || editComponent) &&

                <TableCell className={classes.tableCell} />
              }
            </TableRow>
          </TableHead>
        }

        {
          results &&

          <TableBody className={classes.tableBody}>
            {
              results.map(
                (document, index) =>
                  <Components.DatatableRow collection={collection}
                    columns={columns}
                    document={document}
                    refetch={refetch}
                    key={index}
                    showEdit={showEdit}
                    editComponent={editComponent}
                    currentUser={currentUser}
                    classes={classes}
                    rowClass={rowClass}
                    handleRowClick={handleRowClick}
                  />)
            }
          </TableBody>
        }

        {
          footerData &&

          <TableFooter className={classes.tableFooter}>
            <TableRow className={classes.tableRow}>
              {
                _.sortBy(columns, column => column.order).map(
                  (column, index) =>
                    <TableCell key={index} className={classNames(classes.tableCell, column.footerClass)}>
                      {footerData[index]}
                    </TableCell>
                )
              }
              {
                (showEdit || editComponent) &&

                <TableCell className={classes.tableCell} />
              }
            </TableRow>
          </TableFooter>

        }

      </Table>
      {
        paginate &&

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
      }
      {
        !paginate && loadMore &&

        <Components.LoadMore className={classes.loadMore}
          count={count}
          totalCount={totalCount}
          loadMore={loadMore}
          networkStatus={networkStatus}
        />
      }
    </React.Fragment>
  );
};


replaceComponent('DatatableContents', DatatableContents, [withStyles, datatableContentsStyles]);


/*

DatatableHeader Component

*/
const DatatableHeader = ({ collection, intlNamespace, column, classes, toggleSort, currentSort }, { intl }) => {
  const columnName = typeof column === 'string' ? column : column.name || column.label;
  let formattedLabel = '';

  if (collection) {
    const schema = collection.simpleSchema()._schema;

    /*
    use either:

    1. the column name translation
    2. the column name label in the schema (if the column name matches a schema field)
    3. the raw column name.
    */
    const defaultMessage = schema[columnName] ? schema[columnName].label : Utils.camelToSpaces(columnName);
    formattedLabel = typeof columnName === 'string' &&
      intl.formatMessage({
        id: `${collection._name}.${columnName}`,
        defaultMessage: defaultMessage
      }) || defaultMessage;

    // if sortable is a string, use it as the name of the property to sort by. If it's just `true`, use
    // column.name
    const sortPropertyName = typeof column.sortable === 'string' ? column.sortable : column.name;

    if (column.sortable) {
      return <Components.DatatableSorter name={sortPropertyName}
        label={formattedLabel}
        toggleSort={toggleSort}
        currentSort={currentSort}
        sortable={column.sortable}
      />;
    }
  } else if (intlNamespace) {
    formattedLabel = typeof columnName === 'string' &&
      intl.formatMessage({
        id: `${intlNamespace}.${columnName}`,
        defaultMessage: columnName
      }) || columnName;
  } else {
    formattedLabel = intl.formatMessage({ id: columnName, defaultMessage: columnName });
  }

  return <TableCell
    className={classNames(classes.tableHeadCell, column.headerClass)}>{formattedLabel}</TableCell>;
};


DatatableHeader.contextTypes = {
  intl: intlShape,
};


replaceComponent('DatatableHeader', DatatableHeader);


/*

DatatableSorter Component

*/

const DatatableSorter = ({ name, label, toggleSort, currentSort, sortable }) =>
  <TableCell className="datatable-sorter"
    sortDirection={!currentSort[name] ? false : currentSort[name] === 1 ? 'asc' : 'desc'}
  >
    <Tooltip
      title="Sort"
      placement='bottom-start'
      enterDelay={300}
    >
      <TableSortLabel
        active={!currentSort[name] ? false : true}
        direction={currentSort[name] === 1 ? 'desc' : 'asc'}
        onClick={() => toggleSort(name)}
      >
        {label}
      </TableSortLabel>
    </Tooltip>
  </TableCell>;

replaceComponent('DatatableSorter', DatatableSorter);


/*

DatatableRow Component

*/
const datatableRowStyles = theme => (_assign({}, baseStyles(theme), {
  clickRow: {
    cursor: 'pointer',
  },
  editCell: {
    paddingTop: '0 !important',
    paddingBottom: '0 !important',
    textAlign: 'right',
  },
}));


const DatatableRow = ({
  collection,
  columns,
  document,
  refetch,
  showEdit,
  editComponent,
  currentUser,
  rowClass,
  handleRowClick,
  classes,
}, { intl }) => {

  const EditComponent = editComponent;

  if (typeof rowClass === 'function') {
    rowClass = rowClass(document);
  }

  return (
    <TableRow
      className={classNames('datatable-item', classes.tableRow, rowClass, handleRowClick && classes.clickRow)}
      onClick={handleRowClick && (event => handleRowClick(event, document))}
      hover
    >

      {
        _.sortBy(columns, column => column.order).map(
          (column, index) =>
            <Components.DatatableCell key={index}
              column={column}
              document={document}
              currentUser={currentUser}
              classes={classes}
            />)
      }

      {
        (showEdit || editComponent) &&

        <TableCell className={classes.editCell}>
          {
            EditComponent &&
            <EditComponent collection={collection} document={document} refetch={refetch} />
          }
          {
            showEdit &&
            <Components.EditButton collection={collection}
              document={document}
              buttonClasses={{ button: classes.editButton }}
            />
          }
        </TableCell>
      }

    </TableRow>
  );
};


replaceComponent('DatatableRow', DatatableRow, [withStyles, datatableRowStyles]);


DatatableRow.contextTypes = {
  intl: intlShape
};


/*

DatatableCell Component

*/
const DatatableCell = ({ column, document, currentUser, classes }) => {
  const Component = column.component ||
    Components[column.componentName] ||
    Components.DatatableDefaultCell;

  const columnName = typeof column === 'string' ? column : column.name;
  const className = typeof columnName === 'string' ?
    `datatable-item-${columnName.toLowerCase()}` :
    '';
  const cellClass = typeof column.cellClass === 'function' ?
    column.cellClass({ column, document, currentUser }) :
    typeof column.cellClass === 'string' ?
      column.cellClass :
      null;

  return (
    <TableCell className={classNames(classes.tableCell, cellClass, className)}>
      <Component column={column}
        document={document}
        currentUser={currentUser}
      />
    </TableCell>
  );
};


replaceComponent('DatatableCell', DatatableCell);


/*

DatatableDefaultCell Component

*/
const DatatableDefaultCell = ({ column, document }) =>
  <div>
    {
      typeof column === 'string'
        ?
        getFieldValue(document[column])
        :
        getFieldValue(document[column.name])
    }
  </div>;


replaceComponent('DatatableDefaultCell', DatatableDefaultCell);
