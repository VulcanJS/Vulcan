/* eslint-disable react/no-children-prop */
import React, { Component } from 'react';
import unionClassNames from 'union-class-names';

export default ({ alignment, children }) => (
  class BlockAlignmentButton extends Component {

    activate = (event) => {
      event.preventDefault();
      this.props.setAlignment({ alignment });
    }

    preventBubblingUp = (event) => { event.preventDefault(); }

    isActive = () => this.props.alignment === alignment;

    render() {
      const { theme } = this.props;
      const className = this.isActive() ? unionClassNames(theme.button, theme.active) : theme.button;
      return (
        <div
          className={theme.buttonWrapper}
          onMouseDown={this.preventBubblingUp}
        >
          <button
            className={className}
            onClick={this.activate}
            type="button"
            children={children}
          />
        </div>
      );
    }
  }
);
