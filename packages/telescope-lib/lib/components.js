Telescope.components = {};

Telescope.registerComponent = (name, component) => {
  Telescope.components[name] = component;
};

Telescope.getComponent = (name) => {
  return Telescope.components[name];
};