import { registerComponent } from 'meteor/nova:core';
import React from 'react';
import { IndexLink } from 'react-router';

const Logo = ({logoUrl, siteTitle}) => {
  if (logoUrl) {
    return (
      <h1 className="logo-image ">
        <IndexLink to={{pathname: "/"}}>
          <img src={logoUrl} alt={siteTitle} style={{maxWidth: "100px", maxHeight: "100px"}} />
        </IndexLink>
      </h1>
    )
  } else {
    return (
      <h1 className="logo-text">
        <IndexLink to={{pathname: "/"}}>{siteTitle}</IndexLink>
      </h1>
    )
  }
}

Logo.displayName = "Logo";

registerComponent('Logo', Logo);