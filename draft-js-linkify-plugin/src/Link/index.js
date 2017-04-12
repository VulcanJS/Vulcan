import React, { Component } from 'react';
import unionClassNames from 'union-class-names';
import linkifyIt from 'linkify-it';
import tlds from 'tlds';

const linkify = linkifyIt();
linkify.tlds(tlds);

// The component we render when we encounter a hyperlink in the text
export default class Link extends Component {
  render() {
    const {
      decoratedText = '',
      theme = {},
      target = '_self',
      className,
      component,
      dir, // eslint-disable-line no-unused-vars
      entityKey, // eslint-disable-line no-unused-vars
      getEditorState, // eslint-disable-line no-unused-vars
      offsetKey, // eslint-disable-line no-unused-vars
      setEditorState, // eslint-disable-line no-unused-vars
      contentState, // eslint-disable-line no-unused-vars
      ...otherProps
    } = this.props;

    const combinedClassName = unionClassNames(theme.link, className);
    const links = linkify.match(decoratedText);
    const href = links && links[0] ? links[0].url : '';

    const props = {
      ...otherProps,
      href,
      target,
      className: combinedClassName,
    };

    return component
      ? React.createElement(component, props)
      : <a {...props} />; // eslint-disable-line jsx-a11y/anchor-has-content
  }
}
