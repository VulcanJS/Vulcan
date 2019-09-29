import { registerComponent, getCollection } from 'meteor/vulcan:lib';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'meteor/vulcan:i18n';
import qs from 'qs';
import { withRouter } from 'react-router';
import _isEmpty from 'lodash/isEmpty';
import compose from 'recompose/compose';

import withCurrentUser from '../../containers/currentUser.js';
import withComponents from '../../containers/withComponents';
import withMulti from '../../containers/multi.js';

/*

Datatable Component

*/

// see: http://stackoverflow.com/questions/1909441/jquery-keyup-delay
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

    let initState = {
      value: '',
      query: '',
      currentSort: {},
      currentFilters: {},
    };

    // only load urlState if useUrlState is enabled
    if (props.useUrlState) {
      const urlState = this.getUrlState(props);
      if (urlState.query) {
        initState.value = urlState.query;
        initState.query = urlState.query;
      }
      if (urlState.sort) {
        const [sortKey, sortValue] = urlState.sort.split('|');
        initState.currentSort = { [sortKey]: parseInt(sortValue) };
      }
      if (urlState.filters) {
        initState.currentFilters = urlState.filters;
      }
    }

    this.state = initState;
  }

  getUrlState = props => {
    const p = props || this.props;
    return qs.parse(p.location.search, { ignoreQueryPrefix: true });
  };

  /*

  If useUrlState is not enabled, do nothing

  */
  updateQueryParameter = (key, value) => {
    if (this.props.useUrlState) {
      const urlState = this.getUrlState();

      if (value === null || value === '') {
        // when value is null or empty, remove key from URL state
        delete urlState[key];
      } else {
        urlState[key] = value;
      }
      const queryString = qs.stringify(urlState);
      this.props.history.push({
        search: `?${queryString}`,
      });
    }
  };

  toggleSort = column => {
    let currentSort;
    let urlValue;
    if (!this.state.currentSort[column]) {
      currentSort = { [column]: 1 };
      urlValue = `${column}|1`;
    } else if (this.state.currentSort[column] === 1) {
      currentSort = { [column]: -1 };
      urlValue = `${column}|-1`;
    } else {
      currentSort = {};
      urlValue = null;
    }
    this.setState({ currentSort });
    this.updateQueryParameter('sort', urlValue);
  };

  submitFilters = ({ name, filters }) => {
    // clone state filters object
    let newFilters = Object.assign({}, this.state.currentFilters);
    if (_isEmpty(filters)) {
      // if there are no filter options, remove column filter from state altogether
      delete newFilters[name];
    } else {
      // else, update filters
      newFilters[name] = filters;
    }
    this.setState({ currentFilters: newFilters });
    this.updateQueryParameter('filters', _isEmpty(newFilters) ? null : newFilters);
  };

  updateQuery = e => {
    e.persist();
    e.preventDefault();
    const value = e.target.value;
    this.setState({
      value,
    });
    delay(() => {
      this.setState({
        query: value,
      });
      this.updateQueryParameter('query', value);
    }, 700);
  };

  render() {
    const { Components, modalProps, data } = this.props;

    if (this.props.data) {
      // static JSON datatable

      return (
        <Components.DatatableContents
          Components={Components}
          {...this.props}
          datatableData={data}
          results={this.props.data}
          showEdit={false}
          showNew={false}
          modalProps={modalProps}
        />
      );
    } else {
      // dynamic datatable with data loading

      const collection = this.props.collection || getCollection(this.props.collectionName);
      const options = {
        collection,
        ...this.props.options,
      };

      const DatatableWithMulti = compose(withMulti(options))(Components.DatatableContents);

      // openCRUD backwards compatibility
      const canInsert =
        collection.options &&
        collection.options.mutations &&
        collection.options.mutations.new &&
        collection.options.mutations.new.check(this.props.currentUser);
      const canCreate =
        collection.options &&
        collection.options.mutations &&
        collection.options.mutations.create &&
        collection.options.mutations.create.check(this.props.currentUser);
      // add _id to orderBy when we want to sort a column, to avoid breaking the graphql() hoc;
      // see https://github.com/VulcanJS/Vulcan/issues/2090#issuecomment-433860782
      // this.state.currentSort !== {} is always false, even when console.log(this.state.currentSort) displays {}. So we test on the length of keys for this object.
      const orderBy =
        Object.keys(this.state.currentSort).length == 0
          ? {}
          : { ...this.state.currentSort, _id: -1 };

      const filterBy = this.state.currentFilters;

      const terms = {};
      if (!_isEmpty(this.state.query)) {
        terms.query = this.state.query;
      }
      if (!_isEmpty(orderBy)) {
        terms.orderBy = orderBy;
      }
      if (!_isEmpty(filterBy)) {
        terms.filterBy = filterBy;
      }

      return (
        <Components.DatatableLayout
          Components={Components}
          collectionName={collection.options.collectionName}>
          <Components.DatatableAbove
            Components={Components}
            {...this.props}
            collection={collection}
            canInsert={canInsert || canCreate}
            canUpdate={canInsert || canCreate}
            value={this.state.value}
            updateQuery={this.updateQuery}
          />
          <DatatableWithMulti
            Components={Components}
            {...this.props}
            collection={collection}
            terms={terms}
            currentUser={this.props.currentUser}
            toggleSort={this.toggleSort}
            currentSort={this.state.currentSort}
            submitFilters={this.submitFilters}
            currentFilters={this.state.currentFilters}
          />
        </Components.DatatableLayout>
      );
    }
  }
}

Datatable.propTypes = {
  title: PropTypes.string,
  collection: PropTypes.object,
  columns: PropTypes.array,
  data: PropTypes.array,
  options: PropTypes.object,
  showEdit: PropTypes.bool,
  showNew: PropTypes.bool,
  showSearch: PropTypes.bool,
  newFormOptions: PropTypes.object,
  editFormOptions: PropTypes.object,
  Components: PropTypes.object.isRequired,
  location: PropTypes.shape({ search: PropTypes.string }).isRequired,
};

Datatable.defaultProps = {
  showNew: true,
  showEdit: true,
  showSearch: true,
  useUrlState: true,
};
registerComponent({
  name: 'Datatable',
  component: Datatable,
  hocs: [withCurrentUser, withComponents, withRouter],
});
export default Datatable;

const DatatableLayout = ({ collectionName, children }) => (
  <div className={`datatable datatable-${collectionName}`}>{children}</div>
);
registerComponent({ name: 'DatatableLayout', component: DatatableLayout });

/*

DatatableAbove Component

*/
const DatatableAbove = (props, { intl }) => {
  const {
    collection,
    currentUser,
    showSearch,
    showNew,
    canInsert,
    value,
    updateQuery,
    options,
    newFormOptions,
    Components,
  } = props;

  return (
    <Components.DatatableAboveLayout>
      {showSearch && (
        <Components.DatatableAboveSearchInput
          className="datatable-search form-control"
          placeholder={`${intl.formatMessage({
            id: 'datatable.search',
            defaultMessage: 'Search',
          })}…`}
          type="text"
          name="datatableSearchQuery"
          value={value}
          onChange={updateQuery}
        />
      )}
      {showNew && canInsert && (
        <Components.NewButton
          collection={collection}
          currentUser={currentUser}
          mutationFragmentName={options && options.fragmentName}
          {...newFormOptions}
        />
      )}
    </Components.DatatableAboveLayout>
  );
};
DatatableAbove.contextTypes = {
  intl: intlShape,
};
DatatableAbove.propTypes = {
  Components: PropTypes.object.isRequired,
};
registerComponent('DatatableAbove', DatatableAbove);

const DatatableAboveSearchInput = props => <input {...props} />;
registerComponent({ name: 'DatatableAboveSearchInput', component: DatatableAboveSearchInput });

const DatatableAboveLayout = ({ children }) => <div className="datatable-above">{children}</div>;
registerComponent({ name: 'DatatableAboveLayout', component: DatatableAboveLayout });
