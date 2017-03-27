import { registerComponent, Utils } from 'meteor/vulcan:lib';
import React from 'react';

const Icon = ({ name, iconClass, onClick }) => {
  const icons = Utils.icons;
  const iconCode = !!icons[name] ? icons[name] : name;
  iconClass = (typeof iconClass === 'string') ? ' '+iconClass : '';
  const c = 'icon fa fa-fw fa-' + iconCode + ' icon-' + name + iconClass;
  return <i onClick={onClick} className={c} aria-hidden="true"></i>;
}

Icon.displayName = "Icon";

registerComponent('Icon', Icon);

export default Icon;