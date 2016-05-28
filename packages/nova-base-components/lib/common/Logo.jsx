import React from 'react';

const Logo = ({logoUrl, siteTitle}) => {
  if (logoUrl) {
    return (
      <h1 className="logo-image ">
        <a href="/">
          <img src={logoUrl} alt={siteTitle} style={{maxWidth: "100px", maxHeight: "100px"}} />
        </a>
      </h1>
    )
  } else {
    return (
      <h1 className="logo-text"><a href="/">{siteTitle}</a></h1>
    )
  }
}

Logo.displayName = "Logo";

module.exports = Logo;