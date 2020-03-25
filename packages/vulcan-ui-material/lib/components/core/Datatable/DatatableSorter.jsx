import React from 'react';
import { replaceComponent } from 'meteor/vulcan:core';
import Tooltip from '@material-ui/core/Tooltip';
import TableSortLabel from '@material-ui/core/TableSortLabel';

/*

DatatableSorter Component

*/

const DatatableSorter = ({ name, label, toggleSort, currentSort, sortable }) => (
  <Tooltip title="Sort" placement="bottom-start" enterDelay={300}>
    <TableSortLabel
      active={!currentSort[name] ? false : true}
      direction={currentSort[name] === 1 ? 'desc' : 'asc'}
      onClick={() => toggleSort(name)}>
      {label}
    </TableSortLabel>
  </Tooltip>
);

replaceComponent('DatatableSorter', DatatableSorter);
