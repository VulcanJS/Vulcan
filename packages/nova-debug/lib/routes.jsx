import Cheatsheet from './components/Cheatsheet.jsx';
import Settings from './components/Settings.jsx';
import Emails from './components/Emails.jsx';

Telescope.routes.add([
  {name: "cheatsheet", path: "/cheatsheet", component: Cheatsheet},
  {name: "settings", path: "/settings", component: Settings},
  {name: "emails", path: "/emails", component: Emails},
]);