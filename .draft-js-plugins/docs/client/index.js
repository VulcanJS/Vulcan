import React from 'react';
import { render } from 'react-dom';
import { Router, browserHistory } from 'react-router';

// Import your routes so that you can pass them to the <Router /> component
// eslint-disable-next-line import/no-named-as-default
import routes from './routes';

render((
  <Router routes={routes} history={browserHistory} />
), document.getElementById('root'));
