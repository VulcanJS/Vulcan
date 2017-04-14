import React, { Component } from 'react';
import { Components, registerComponent, withCurrentUser } from 'meteor/vulcan:core';

class ImageAdd extends Component {
  // Start the popover closed
  constructor(props) {
    super(props);
    this.state = { url: '', open: false };
    this.componentDidMount = this.componentDidMount.bind(this);
    this.componentWillUnmount = this.componentWillUnmount.bind(this);
    this.onPopoverClick = this.onPopoverClick.bind(this);
    this.openPopover = this.openPopover.bind(this);
    this.closePopover = this.closePopover.bind(this);
    this.addImage = this.addImage.bind(this);
    this.changeUrl = this.changeUrl.bind(this);
  }

  // When the popover is open and users click anywhere on the page,
  // the popover should close
  componentDidMount() {
    document.addEventListener('click', this.closePopover);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.closePopover);
  }

  // Note: make sure whenever a click happens within the popover it is not closed
  onPopoverClick() {
    this.preventNextClose = true;
  }

  openPopover() {
    if (!this.state.open) {
      this.preventNextClose = true;
      this.setState({
        open: true,
      });
    }
  };

  closePopover() {
    if (!this.preventNextClose && this.state.open) {
      this.setState({
        open: false,
      });
    }

    this.preventNextClose = false;
  };

  addImage() {
    const { editorState, onChange, modifier } = this.props;
    onChange(modifier(editorState, this.state.url));
  };

  changeUrl(evt) {
    this.setState({ url: evt.target.value });
  }

  render() {
    const popoverClassName = this.state.open ?
      'addImagePopover' :
      'addImageClosedPopover';
    const buttonClassName = this.state.open ?
      'addImagePressedButton' :
      'addImageButton';

    return (
      <div className={'addImage'}>
        <button
          className={buttonClassName}
          onMouseUp={this.openPopover}
          type="button"
        >
          +
        </button>
        <div
          className={popoverClassName}
          onClick={this.onPopoverClick}
        >
          <input
            type="text"
            placeholder="Paste the image url …"
            className={'addImageInput'}
            onChange={this.changeUrl}
            value={this.state.url}
          />
          <button
            className={'addImageConfirmButton'}
            type="button"
            onClick={this.addImage}
          >
            Add
          </button>
        </div>
      </div>
    );
  }
};

registerComponent('ImageAdd', ImageAdd, withCurrentUser);
