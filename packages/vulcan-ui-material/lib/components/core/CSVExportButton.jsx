import React, { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import flatten from 'flat';

import { Components, extractCollectionInfo } from 'meteor/vulcan:lib';
import { replaceComponent, withMulti2 } from 'meteor/vulcan:core';
import { CSVLink } from 'react-csv';

import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';

import File from 'mdi-material-ui/File';
import FileRemove from 'mdi-material-ui/FileRemove';
import CloudDownload from 'mdi-material-ui/CloudDownload';
import AlertCircle from 'mdi-material-ui/AlertCircle';

import { FormattedMessage } from 'meteor/vulcan:i18n';

const removeElementsErrorCausing = ({ results, headers }) => {
  const problematicHeaders = headers.filter(header => header.includes('.')); //The array and object elements
  const validatedElements = results.map(element => {
    problematicHeaders.forEach(header => {
      const headerSplited = header.split('.');
      var obj = element[headerSplited[0]];
      for (var i = 1; i < headerSplited.length; i++) {
        try {
          //to access every problematic element
          obj = obj[headerSplited[i]];
        } catch (err) {
          //if null just create a void element
          element[headerSplited.slice(0, i).shift()] = {};
          obj = element[headerSplited.slice(0, i + 1).shift()];
        }
      }
    });
    return element;
  });
  return validatedElements;
};

/**
 * WARNING: make sure to set the fragment you want for this, and **exclude any field containing arrays**. It does not like arrays and will break.
 * Also, the export might not be pretty if there is some text from textarea inputs, because of linebreaks.
 */

const CSVExportButton = props => {
  const [stage, setStage] = useState('create');
  const { collection } = extractCollectionInfo(props);
  const { input, options } = props;
  switch (stage) {
    case 'create':
      return (
        <Tooltip title={<FormattedMessage id="exportbutton.create" />}>
          <IconButton
            onClick={() => {
              setStage('download');
            }}>
            <File />
          </IconButton>
        </Tooltip>
      );
    case 'download':
      const listOptions = {
        collection,
        ...options,
      };
      const CSVExportWithList = withMulti2(listOptions)(CSVExport);
      return <CSVExportWithList collection={collection} input={input} />;
    default:
      return (
        <Tooltip title={<FormattedMessage id="exportbutton.error" />}>
          <IconButton onClick={reloadPage}>
            <AlertCircle color="error" />
          </IconButton>
        </Tooltip>
      );
  }
};
CSVExportButton.propTypes = {
  collectionName: PropTypes.string,
  collection: PropTypes.object,
  options: PropTypes.object,
  terms: PropTypes.object,
};
replaceComponent('CSVExportButton', CSVExportButton);

function reloadPage() {
  window.location.reload();
}

const CSVExport = props => {
  const { results, loading, totalCount, collection, error } = props;

  const fieldsNotExport = ['__typename'];
  if (loading) {
    return <Components.Loading />;
  } else if (error) {
    return (
      <Tooltip title={<FormattedMessage id="exportbutton.error" />}>
        <IconButton onClick={reloadPage}>
          <AlertCircle color="error" />
        </IconButton>
      </Tooltip>
    );
  } else if (!results || !results.length) {
    return (
      <Tooltip title={<FormattedMessage id="exportbutton.noResults" />}>
        <IconButton>
          <FileRemove />
        </IconButton>
      </Tooltip>
    );
  }
  // merge all flattened reduces and take their keys
  // those keys will be the csv headers
  // NOTE: not very robust, we might need to add an additional props to define headers, like
  // the fields prop in SmartForm
  const headers = Object.keys(
    results.reduce((res, item) => {
      return {
        ...res,
        ...flatten(item),
      };
    }, {})
  ).filter(header => !fieldsNotExport.includes(header));

  const validateResults = removeElementsErrorCausing({ results, headers });
  const filename = collection._name + moment(new Date()).format('YYYY-MM-DD HH:mm') + '.csv';
  return (
    <Tooltip title={<FormattedMessage id="exportbutton.download" values={{ totalCount }} />}>
      <CSVLink headers={headers} data={validateResults} separator=";" filename={filename}>
        <IconButton>
          <CloudDownload color="secondary" />
        </IconButton>
      </CSVLink>
    </Tooltip>
  );
};
