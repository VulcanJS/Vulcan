import { registerComponent, Utils } from 'meteor/nova:lib';
import React from 'react';

const Icon = ({ name, iconClass }) => {
  const icons = Utils.icons;
  const iconCode = !!icons[name] ? icons[name] : name;
  iconClass = (typeof iconClass === 'string') ? ' '+iconClass : '';
  const c = 'icon fa fa-fw fa-' + iconCode + ' icon-' + name + iconClass;
  return <i className={c} aria-hidden="true"></i>;
}

Icon.displayName = "Icon";

registerComponent('Icon', Icon);

export default Icon;