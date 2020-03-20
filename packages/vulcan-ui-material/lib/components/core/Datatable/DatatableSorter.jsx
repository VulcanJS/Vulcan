import React from 'react';
import { replaceComponent } from 'meteor/vulcan:core';
import TableCell from '@material-ui/core/TableCell';
import Tooltip from '@material-ui/core/Tooltip';
import TableSortLabel from '@material-ui/core/TableSortLabel';

/*

DatatableSorter Component

*/

const DatatableSorter = ({ name, label, toggleSort, currentSort, sortable }) => (
  <TableCell className="datatable-sorter" sortDirection={!currentSort[name] ? false : currentSort[name] === 1 ? 'asc' : 'desc'}>
    <Tooltip title="Sort" placement="bottom-start" enterDelay={300}>
      <TableSortLabel
        active={!currentSort[name] ? false : true}
        direction={currentSort[name] === 1 ? 'desc' : 'asc'}
        onClick={() => toggleSort(name)}>
        {label}
      </TableSortLabel>
    </Tooltip>
  </TableCell>
);

replaceComponent('DatatableSorter', DatatableSorter);
