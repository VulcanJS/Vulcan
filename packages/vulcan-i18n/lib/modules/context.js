import React, { Component } from 'react';

const IntlContext = React.createContext({
  locale: '',
  key: '',
  messages: [],
});

export default IntlContext;