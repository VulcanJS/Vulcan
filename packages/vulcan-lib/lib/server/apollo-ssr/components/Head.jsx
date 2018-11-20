import React from 'react';
import { Helmet } from 'react-helmet';

const Head = () => {
  // Helmet.rewind() is deprecated in favour of renderStatic() for better readability
  //@see https://github.com/nfl/react-helmet/releases/tag/5.0.0
  const helmet = Helmet.renderStatic();
  return (
    <head>
      {helmet.title.toComponent()}
      {helmet.meta.toComponent()}
      {helmet.link.toComponent()}
    </head>
  );
};
export default Head;
