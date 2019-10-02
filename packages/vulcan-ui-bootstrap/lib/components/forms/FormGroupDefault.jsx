import React from 'react';
import PropTypes from 'prop-types';
import { Components, Utils } from 'meteor/vulcan:core';
import classNames from 'classnames';
import { registerComponent } from 'meteor/vulcan:core';

const FormGroupHeader = ({ toggle, collapsed, label }) => (
  <div className="form-section-heading" onClick={toggle}>
    <h3 className="form-section-heading-title">{label}</h3>
    <span className="form-section-heading-toggle">
      {collapsed ? (
        <Components.IconRight height={16} width={16}/>
      ) : (
        <Components.IconDown height={16} width={16}/>
      )}
    </span>
  </div>
);
FormGroupHeader.propTypes = {
  toggle: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  collapsed: PropTypes.bool,
  group: PropTypes.object,
};
registerComponent({ name: 'FormGroupHeader', component: FormGroupHeader });

const FormGroupLayout = ({ children, label, anchorName, heading, collapsed, hidden, group, hasErrors }) => (
  <div className={classNames('form-section', `form-section-${anchorName}`, 
    `form-section-${Utils.slugify(label)}`, hidden && 'form-section-hidden')}>
    <a name={anchorName}/>
    {heading}
    <div
      className={classNames({
        'form-section-collapsed': collapsed && !hasErrors
      })}
    >
      {children}
    </div>
  </div>
);
FormGroupLayout.propTypes = {
  label: PropTypes.string,
  anchorName: PropTypes.string,
  heading: PropTypes.node,
  collapsed: PropTypes.bool,
  hidden: PropTypes.bool,
  group: PropTypes.object,
  hasErrors: PropTypes.bool,
  children: PropTypes.node
};
registerComponent({ name: 'FormGroupLayout', component: FormGroupLayout });

const IconRight = ({ width = 24, height = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 24 24"
  >
    <polyline
      fill="none"
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit="10"
      points="5.5,23.5 18.5,12 5.5,0.5"
      id="Outline_Icons"
    />
    <rect fill="none" width="24" height="24" id="Frames-24px"/>
  </svg>
);

registerComponent('IconRight', IconRight);

const IconDown = ({ width = 24, height = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 24 24"
  >
    <polyline
      fill="none"
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit="10"
      points="0.501,5.5 12.001,18.5 23.501,5.5"
      id="Outline_Icons"
    />
    <rect fill="none" width="24" height="24" id="Frames-24px"/>
  </svg>
);

registerComponent('IconDown', IconDown);
