import { registerComponent, Components } from 'meteor/vulcan:lib';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import withCurrentUser from '../containers/withCurrentUser.js';
import withList from '../containers/withList.js';
import { FormattedMessage } from 'meteor/vulcan:i18n';
import Button from 'react-bootstrap/lib/Button';

/*

Datatable Component

*/

// see: http://stackoverflow.com/questions/1909441/jquery-keyup-delay
const delay = (function(){
  var timer = 0;
  return function(callback, ms){
    clearTimeout (timer);
    timer = setTimeout(callback, ms);
  };
})();

class Datatable extends PureComponent {

  constructor() {
    super();
    this.updateQuery = this.updateQuery.bind(this);
    this.state = {
      value: '',
      query: ''
    }
  }

  updateQuery(e) {
    e.persist()
    e.preventDefault();
    this.setState({
      value: e.target.value
    });
    delay(() => {
      this.setState({
        query: e.target.value
      });
    }, 700 );
  }

  render() {

    const options = {
      collection: this.props.collection,
      ...this.props.options
    }

    const DatatableWithList = withList(options)(Components.DatatableContents);

    return (
      <div className="datatable">
        <input className="datatable-search" placeholder="Search…" type="text" name="datatableSearchQuery" value={this.state.value} onChange={this.updateQuery} />
        <DatatableWithList {...this.props} terms={{query: this.state.query}} />
      </div>
    )
  }
}

Datatable.propTypes = {
  collection: PropTypes.object,
  columns: PropTypes.array,
  options: PropTypes.object
}
registerComponent('Datatable', Datatable, withCurrentUser);

/*

DatatableContents Component

*/

const DatatableContents = (props) => {
  const {columns, results, loading, loadMore, count, totalCount, networkStatus} = props;

  if (loading) {
    return <Components.Loading />;
  }

  const isLoadingMore = networkStatus === 2;
  const hasMore = totalCount > results.length;

  return (
    <div className="datatable-list">
      <table className="table">
        <thead>
          <tr>
            {_.sortBy(columns, column => column.order).map(column => <th key={column.name}><FormattedMessage id={`datatable.${column.name}`} /></th>)}
          </tr>
        </thead>
        <tbody>
          {results.map(document => <Components.DatatableItem columns={columns} document={document} key={document._id}/>)}
        </tbody>
      </table>
      <div className="admin-users-load-more">
        {hasMore ? 
          isLoadingMore ? 
            <Components.Loading/> 
            : <Button bsStyle="primary" onClick={e => {e.preventDefault(); loadMore();}}>Load More ({count}/{totalCount})</Button> 
          : null
        }
      </div>
    </div>
  )
}
registerComponent('DatatableContents', DatatableContents);

/*

DatatableItem Component

*/

const DatatableItem = ({ columns, document }) => {
  return (
  <tr className="datatable-item">
    {_.sortBy(columns, column => column.order).map(column => {
      const Component = column.component || Components[column.componentName];
      return <td key={column.name} className={`datatable-item-${column.name.replace('users.', '')}`}><Component document={document} /></td>
    })}
  </tr>
  )
}
registerComponent('DatatableItem', DatatableItem);

export default Datatable;