import Telescope from 'meteor/nova:lib';
import Cheatsheet from './components/Cheatsheet.jsx';
import Groups from './components/Groups.jsx';
import Settings from './components/Settings.jsx';
import Emails from './components/Emails.jsx';

Telescope.routes.add([
  {name: "cheatsheet", path: "/cheatsheet", component: Cheatsheet},
  {name: "groups", path: "/groups", component: Groups},
  {name: "settings", path: "/settings", component: Settings},
  {name: "emails", path: "/emails", component: Emails},
]);