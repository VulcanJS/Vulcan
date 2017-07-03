import { withRouter } from 'react-router'
import { Components, registerComponent } from 'meteor/vulcan:core'
import React from 'react'

const LegacyPostRedirect = (props) => <div className="legacy-redirect">
  <Components.LegacyPostWrapper terms={{view: "legacyPostUrl", legacyUrlId: props.params.id}} />
</div>

registerComponent("LegacyPostRedirect", LegacyPostRedirect, withRouter);
