/*
The original Logo components is defined using React's
functional stateless component syntax, so we redefine
it the same way. 
*/

import React from 'react';
import { IndexLink } from 'react-router';

const CustomLogo = ({logoUrl, siteTitle}) => {
  return (
    <h1 className="logo-text"><IndexLink to="/">⭐{siteTitle}⭐</IndexLink></h1>
  )
}

export default CustomLogo;