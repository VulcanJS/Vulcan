/*

children: the content of the tooltip
trigger: the component that triggers the tooltip to appear

*/
import React from 'react';
import { registerComponent } from 'meteor/vulcan:core';
import Tooltip from 'react-bootstrap/lib/Tooltip';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';

const TooltipTrigger = ({ children, trigger, placement = 'top', ...rest }) => {
  const tooltip = <Tooltip id="tooltip">{children}</Tooltip>;

  return (
    <OverlayTrigger placement={placement} {...rest} overlay={tooltip}>
      {trigger}
    </OverlayTrigger>
  );
};

registerComponent('TooltipTrigger', TooltipTrigger);
