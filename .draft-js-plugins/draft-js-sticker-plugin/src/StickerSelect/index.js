import React, { Component } from 'react';
import StickerOption from './StickerOption';
import addSticker from '../modifiers/addSticker';

/**
 * Sets the CSS overflow value to newValue
 * Use like this: setOverflow('auto', document.body);
 */
function setOverflow(newValue, element) {
  element.style.overflow = newValue; // eslint-disable-line no-param-reassign
}

/**
 * Sticker Selector Component
 */
export default class StickerSelect extends Component {
  // Start the selector closed
  state = {
    open: false,
  };

  // When the selector is open and users click anywhere on the page,
  // the selector should close
  componentDidMount() {
    document.addEventListener('click', this.closePopover);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.closePopover);
  }

  // When users are scrolling the popover, the page shouldn't scroll when
  // they reach the end of it
  onMouseEnter = () => {
    setOverflow('hidden', document.body);
  };

  onMouseLeave = () => {
    setOverflow('auto', document.body);
  };

  // Open the popover
  openPopover = () => {
    if (!this.state.open) {
      this.preventNextClose = true;
      this.setState({
        open: true,
      });
    }
  };

  // Close the popover
  closePopover = () => {
    if (!this.preventNextClose && this.state.open) {
      this.setState({
        open: false,
      });
    }

    this.preventNextClose = false;
  };

  // Add a sticker to the editor
  add = (id) => {
    const { editor } = this.props;
    editor.onChange(addSticker(editor.state.editorState, id));
  };

  render() {
    // Create the sticker selection elements
    const stickerElements = this.props.stickers.get('data').map((sticker) => {
      const id = sticker.get('id');
      const url = sticker.get('url');
      return (
        <StickerOption
          theme={this.props.theme}
          key={id}
          onClick={this.add}
          id={id}
          url={url}
        />
      );
    });

    const { theme = {} } = this.props;
    const popoverClassName = this.state.open ?
      theme.selectPopover :
      theme.selectClosedPopover;
    const buttonClassName = this.state.open ?
      theme.selectPressedButton :
      theme.selectButton;

    return (
      <div className={theme.select}>
        <button
          className={buttonClassName}
          onMouseUp={this.openPopover}
          type="button"
        >
          {this.props.selectButtonContent}
        </button>
        <div
          className={popoverClassName}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
        >
          <div className={theme.selectStickerList}>
            {stickerElements.toList().toJS()}
          </div>
          <div className={theme.selectBottomGradient} />
        </div>
      </div>
    );
  }
}
