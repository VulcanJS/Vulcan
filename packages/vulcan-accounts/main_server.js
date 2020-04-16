import { Accounts } from 'meteor/accounts-base';
import './imports/accounts_ui.js';
import './imports/components.js';
import './imports/login_session.js';
import './imports/routes.js';
import './imports/oauth_config.js';
import './imports/emailTemplates.js';
import { redirect, STATES } from './imports/helpers.js';
import './imports/api/server/servicesListPublication.js';
import useMeteorLogout from './imports/useMeteorLogout.js';

import './imports/ui/components/LoginForm.jsx';

export { Accounts, redirect, STATES, useMeteorLogout };
export default Accounts;
