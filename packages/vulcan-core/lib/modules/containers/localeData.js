import React from 'react';
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { getSetting, detectLocale } from 'meteor/vulcan:lib';
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

Figure out the correct locale to use based on the current user, cookies, 
and browser settings

*/
export const initLocale = ({ currentUser = {}, cookies = {}, locale }) => {
  let userLocale = '';
  let localeMethod = '';
  const detectedLocale = detectLocale();

  if (locale) {
    // 1. locale is passed from AppGenerator through SSR process
    userLocale = locale;
    localeMethod = 'SSR';
  } else if (cookies.locale) {
    // 2. look for a cookie
    userLocale = cookies.locale;
    localeMethod = 'cookie';
  } else if (currentUser && currentUser.locale) {
    // 3. if user is logged in, check for their preferred locale
    userLocale = currentUser.locale;
    localeMethod = 'user';
  } else if (detectedLocale) {
    // 4. else, check for browser settings
    userLocale = detectedLocale;
    localeMethod = 'browser';
  }

  /* 
  
  NOTE: locale fallback doesn't work anymore because we can now load locales dynamically
  and Strings[userLocale] will then be empty

  */
  // if user locale is available, use it; else compare first two chars
  // of user locale with first two chars of available locales
  // const availableLocales = Object.keys(Strings);
  // const availableLocale = Strings[userLocale] ? userLocale : availableLocales.find(locale => locale.slice(0, 2) === userLocale.slice(0, 2));

  const availableLocale = userLocale;

  // 4. if user-defined locale is available, use it; else default to setting or `en-US`
  if (availableLocale) {
    return { localeId: availableLocale, localeMethod };
  } else {
    return { localeId: getSetting('locale', 'en-US'), localeMethod: 'setting' };
  }
};

/*

Hook

*/
export const useLocaleData = (props) => {
  const [cookies] = useCookies(['locale']);
  const { currentUser } = useCurrentUser();
  const init = initLocale({ currentUser, cookies, locale: props.locale });
  const queryResult = useQuery(localeDataQuery, { variables: { localeId: init.localeId } });
  return {...queryResult, ...init};
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
