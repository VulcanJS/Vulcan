import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Components as C, registerComponent } from 'meteor/vulcan:core';


class DatatableFromArray extends PureComponent {
  
  
  constructor (props) {
    super(props);
    
    this.state = {
      paginationTerms: {
        itemsPerPage: props.itemsPerPage || 25,
        limit: props.itemsPerPage || 25,
        offset: 0,
      }
    };
  }
  
  
  setPaginationTerms = (paginationTerms) => {
    this.setState({ paginationTerms });
  };
  
  
  render () {
    const { paginate, data } = this.props;
    const { itemsPerPage, offset } = this.state.paginationTerms;
    const dataPage = paginate ? data.slice(offset, offset + itemsPerPage) : data;
    
    return (
      <C.Datatable {...this.props}
                   results={dataPage}
                   count={dataPage.length}
                   totalCount={data.length}
                   showEdit={false}
                   showNew={false}
                   paginationTerms={paginate ? this.state.paginationTerms : undefined}
                   setPaginationTerms={paginate ? this.setPaginationTerms : undefined}
      />
    );
    
  }
  
}

DatatableFromArray.propTypes = {
  data: PropTypes.array,
  paginate: PropTypes.bool,
  itemsPerPage: PropTypes.number,
};


DatatableFromArray.displayName = 'DatatableFromArray';


registerComponent('DatatableFromArray', DatatableFromArray);
