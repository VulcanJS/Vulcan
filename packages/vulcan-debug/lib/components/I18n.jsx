import React from 'react';
import { registerComponent, Components, Strings, Locales } from 'meteor/vulcan:lib';
import PropTypes from 'prop-types';
import sortedUniq from 'lodash/sortedUniq';

/**
 * Internationalization debugging page
 *
 *
 **/
function LocaleSwitcher(props, context) {
  return (
    <div>
      <span>Switch locales :</span>
      {Locales.map(localeObj => (
        <Components.Button key={localeObj.id} onClick={() => context.setLocale(localeObj.id)}>
          {localeObj.label}
        </Components.Button>
      ))}
    </div>
  );
}
LocaleSwitcher.contextTypes = {
  getLocale: PropTypes.func,
  setLocale: PropTypes.func,
};

export const I18n = (props, context) => {
  // translations holds all the translations ids
  let translations = [];
  let columns = [
    {
      name: 'id',
      component: function({ document }) {
        return document;
      },
    },
  ];

  // reunite all the ids in a single array (translations) and create the columns for each language
  Object.keys(Strings).forEach(language => {
    translations.push(...Object.keys(Strings[language]));
    columns.push({
      name: language,
      component: function({ document }) {
        return Strings[language][document] || null;
      },
    });
  });

  //sort the array
  translations.sort();
  //remove duplicates
  let translationsUniq = sortedUniq(translations);

  return (
    <div>
      <h3>{'Your current locale: ' + context.getLocale()}</h3>
      <LocaleSwitcher />
      <Components.Datatable showSearch={false} showNew={false} showEdit={false} data={translationsUniq} columns={columns} />
    </div>
  );
};

I18n.contextTypes = {
  getLocale: PropTypes.func,
  setLocale: PropTypes.func,
};

registerComponent({ name: 'I18n', component: I18n, hocs: [] });
