import React, { Component } from 'react';
import { graphql } from 'react-apollo';   
import gql from 'graphql-tag';    

const withSiteData = component => {

  return graphql(
    gql`
      query getSiteData {
        SiteData {
          url
          title
          sourceVersion
          logoUrl
        }
      }
    `, {
      alias: 'withSiteData',
      
      props(props) {
        const { data } = props;
        return {
          siteDataLoading: data.loading,
          siteData: data.SiteData,
          siteDataData: data,
        };
      },
    }
  )(component);
}

export default withSiteData;
