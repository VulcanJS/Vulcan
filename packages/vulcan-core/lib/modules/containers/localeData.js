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
  const init = initLocale({ currentUser, cookies, locale: props.locale });
  console.log(init);
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

export default withLocaleData;
