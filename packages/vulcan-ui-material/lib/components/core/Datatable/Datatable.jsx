import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  Components,
  replaceComponent,
  withCurrentUser,
  withMulti
} from 'meteor/vulcan:core';
import compose from 'recompose/compose';
import withStyles from '@material-ui/core/styles/withStyles';
import Table from '@material-ui/core/Table';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import classNames from 'classnames';
import { getCollection } from 'meteor/vulcan:lib'

/*

Datatable Component

*/
export const baseStyles = theme => ({
  root: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scroller: {
		overflowX: 'auto',
		overflowY: 'hidden'
  },
  searchWrapper: {},
  addButtonWrapper: {
    alignItems: 'center',
  },
  addButton: {
    // Floating button won't work with multiple datatables, buttons are superposed
    // top: '9.5rem',
    // right: '2rem',
    // position: 'fixed',
    // bottom: 'auto',
  },
  table: {
    marginTop: 0,
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
  editButton: {},
});

const delay = (function() {
  var timer = 0;
  return function(callback, ms) {
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
      value: value,
    });
    delay(() => {
      this.setState({
        query: value,
      });
    }, 700);
  }

  render() {
    if (this.props.data) {
      return (
        <Components.DatatableContents
          columns={this.props.data.length ? Object.keys(this.props.data[0]) : undefined}
          results={this.props.data}
          count={this.props.data.length}
          totalCount={this.props.data.length}
          showEdit={false}
          showNew={false}
          {...this.props}
        />
      );
    } else {
      const { className, options, showSearch, showNew, classes } = this.props;

      const collection = this.props.collection || getCollection(this.props.collectionName);

      const listOptions = {
        collection: collection,
        ...options,
      };

      const DatatableWithMulti = compose(withMulti(listOptions))(Components.DatatableContents);

      // add _id to orderBy when we want to sort a column, to avoid breaking the graphql() hoc;
      // see https://github.com/VulcanJS/Vulcan/issues/2090#issuecomment-433860782
      // this.state.currentSort !== {} is always false, even when console.log(this.state.currentSort) displays
      // {}. So we test on the length of keys for this object.
      const orderBy =
        Object.keys(this.state.currentSort).length == 0
          ? {}
          : { ...this.state.currentSort, _id: -1 };

      return (
        <div
          className={classNames(
            'datatable',
            `datatable-${collection._name}`,
            classes.root,
            className
          )}>
          {/* DatatableAbove Component part*/}
          {(showSearch || showNew) && (
            <div className={classes.header}>
              {showSearch && (
                <div className={classes.searchWrapper}>
                  <Components.SearchInput
                    value={this.state.query}
                    updateQuery={this.updateQuery}
                    className={classes.search}
                    labelId={'datatable.search'}
                  />
                </div>
              )}
              {showNew && (
                <div className={classes.addButtonWrapper}>
                  <Components.NewButton
                    collection={collection}
                    variant="fab"
                    color="primary"
                    className={classes.addButton}
                  />
                </div>
              )}
            </div>
          )}

          <div className={classes.scroller}>
            <DatatableWithMulti
              {...this.props}
              collection={collection}
              terms={{ query: this.state.query, orderBy: orderBy }}
              currentUser={this.props.currentUser}
              toggleSort={this.toggleSort}
              currentSort={this.state.currentSort}
            />
          </div>
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

const DatatableTitle = ({ title }) => (
  <Toolbar>
    <Typography variant="h6" id="tableTitle">
      {title}
    </Typography>
  </Toolbar>
);
replaceComponent('DatatableTitle', DatatableTitle);

const DatatableContentsInnerLayout = Table;
replaceComponent('DatatableContentsInnerLayout', DatatableContentsInnerLayout);



