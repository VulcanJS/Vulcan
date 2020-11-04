import React from 'react';
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';

const siteDataQuery = gql`
      query getSiteData {
        siteData {
          url
          title
          sourceVersion
          logoUrl
        }
      }
    `;
export const useSiteData = () => (
  useQuery(siteDataQuery)
);

export const withSiteData = C => {
  const Wrapped = (props) => {
    const res = useSiteData();
    const { loading, data } = res;
    const namedRes =
    {
      siteDataLoading: loading,
      siteData: data && data.SiteData,
      siteDataData: data,
    };
    return <C {...props} {...namedRes} />;
  };
  Wrapped.displayName = 'withSiteData';
  return Wrapped;
};

export default withSiteData;
/*
return graphql(
    , {
    alias: 'withSiteData',

    props(props) {
      const { data } = props;
      return {
        siteDataLoading: data.loading,
        siteData: data.siteData,
        siteDataData: data,
      };
    },
  }
)(component);
};
*/

