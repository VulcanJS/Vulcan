/**
 * @Author: Apollinaire Lecocq <apollinaire>
 * @Date:   24-01-19
 * @Last modified by:   apollinaire
 * @Last modified time: 19-02-19
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import flatten from 'flat';

import withMulti from '../containers/multi2.js';
import { registerComponent, Components, extractCollectionInfo } from 'meteor/vulcan:lib';
import { CSVLink } from 'react-csv';

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
        <Components.Button
          onClick={() => {
            setStage('download');
          }}>
          <FormattedMessage id="exportbutton.create" />
        </Components.Button>
      );
    case 'download':
      const listOptions = {
        collection,
        ...options,
      };
      const CSVExportWithList = withMulti(listOptions)(CSVExport);
      return <CSVExportWithList collection={collection} input={input} />;
    default:
      return (
        <Components.Button onClick={reloadPage}>
          <FormattedMessage id="exportbutton.error" />
        </Components.Button>
      );
  }
};
CSVExportButton.propTypes = {
  collectionName: PropTypes.string,
  collection: PropTypes.object,
  options: PropTypes.object,
  terms: PropTypes.object,
};
registerComponent('CSVExportButton', CSVExportButton);

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
      <Components.Button onClick={reloadPage}>
        <FormattedMessage id="exportbutton.error" />
      </Components.Button>
    );
  } else if (!results || !results.length) {
    <Components.Button>
      <FormattedMessage id="exportbutton.noResults" />
    </Components.Button>;
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
    <CSVLink headers={headers} data={validateResults} separator=";" filename={filename}>
      <Components.Button>
        <FormattedMessage id="exportbutton.download" values={{ totalCount }} />
      </Components.Button>
    </CSVLink>
  );
};
