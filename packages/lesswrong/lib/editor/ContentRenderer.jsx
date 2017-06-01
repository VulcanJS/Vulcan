import React, { Component } from 'react';
import { Components, registerComponent } from 'meteor/vulcan:core';
import { HTMLRenderer } from 'ory-editor-renderer'
import withEditor from './withEditor.jsx'

// The rich text area plugin
import slate from 'ory-editor-plugins-slate'

// The spacer plugin
import spacer from 'ory-editor-plugins-spacer'

// The image plugin
import image from 'ory-editor-plugins-image'

// The video plugin
import video from 'ory-editor-plugins-video'

// The parallax plugin
import parallax from 'ory-editor-plugins-parallax-background'

// The divider plugin
import divider from 'ory-editor-plugins-divider'

class ContentRenderer extends Component {
  render() {
    const state = JSON.parse(JSON.stringify(this.props.state));

    const plugins = {
      content: [slate(), spacer, image, video, divider],
      layout: [parallax({ defaultPlugin: slate() })] // Define plugins for layout cells
    };
    return (
      <HTMLRenderer state={state} plugins={plugins} />
    );
  }
}

registerComponent('ContentRenderer', ContentRenderer);
