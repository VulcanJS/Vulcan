import SmartContainers from "meteor/utilities:react-list-container";
import FormContainers from "meteor/utilities:react-form-containers";

Telescope.registerComponent("AppContainer", require('./containers/AppContainer.jsx'));
// Telescope.registerComponent("DocumentContainer", require('./containers/DocumentContainer.jsx'));
// Telescope.registerComponent("ListContainer", require('./containers/ListContainer.jsx'));

Telescope.registerComponent("DocumentContainer", SmartContainers.DocumentContainer);
Telescope.registerComponent("ListContainer", SmartContainers.ListContainer);

// Telescope.registerComponent("DocumentContainer", DocumentContainer);
// Telescope.registerComponent("ListContainer", ListContainer);

Telescope.registerComponent("FlashContainer", require('./containers/FlashContainer.jsx'));
Telescope.registerComponent("CurrentUserContainer", require('./containers/CurrentUserContainer.jsx'));

// Telescope.registerComponent("NewDocContainer", require('./containers/NewDocContainer.jsx'));
// Telescope.registerComponent("EditDocContainer", require('./containers/EditDocContainer.jsx'));

Telescope.registerComponent("NewDocContainer", FormContainers.NewDocContainer);
Telescope.registerComponent("EditDocContainer", FormContainers.EditDocContainer);

Telescope.registerComponent("ModalTrigger", require('./components/ModalTrigger.jsx'));
