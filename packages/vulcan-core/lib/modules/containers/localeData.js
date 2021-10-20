import React from 'react';
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { initLocale } from 'meteor/vulcan:lib';
import { useCurrentUser } from './currentUser';
import { useCookies } from 'react-cookie';

/*

Query to load strings for a specific locale from the server

*/
export const localeDataQuery = gql`
  query LocaleData($localeId: String) {
    locale(localeId: $localeId) {
      id
      strings
    }
  }
`;


/*

Hook

*/
export const useLocaleData = props => {
  const [cookies] = useCookies(['locale']);
  const { currentUser } = useCurrentUser();
  const init = initLocale({ currentUser, cookies, locale: props.locale, dynamicLocales: props?.locales?.data?.locales });
  const queryResult = useQuery(localeDataQuery, { variables: { localeId: init.id } });
  return { ...queryResult, ...init };
};

/*

HoC

*/
export const withLocaleData = C => {
  const Wrapped = props => {
    const response = useLocaleData(props);
    return <C {...props} locale={response} />;
  };
  Wrapped.displayName = 'withLocaleData';
  return Wrapped;
};


/*

Query to load all locales metadata from the server

*/
export const localesQuery = gql`
  query LocalesQuery {
    locales {
      id
      label
    }
  }
`;


/*

Hook

*/
export const useLocales = props => {
  const queryResult = useQuery(localesQuery);
  return queryResult;
};

/*

HoC

*/
export const withLocales = C => {
  const Wrapped = props => {
    const response = useLocales(props);
    return <C {...props} locales={response} />;
  };
  Wrapped.displayName = 'withLocales';
  return Wrapped;
};
