import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'meteor/vulcan:i18n';
import { Components, registerComponent, deprecate, instantiateComponent } from 'meteor/vulcan:core';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import classNames from 'classnames';
import _omit from 'lodash/omit';


const styles = theme => ({
  root: {},
  button: {},
  anchor: {},
  dialog: {},
  dialogPaper: {},
  dialogTitle: {},
  dialogTitleEmpty: {},
  dialogContent: {},
  dialogOverflow: {},
  closeButton: {},
});

class ModalTrigger extends PureComponent {

  constructor(props) {
    super(props);

    this.state = { modalIsOpen: false };
  }

  componentDidMount() {
    if (this.props.action) {
      this.props.action({
        openModal: this.openModal,
        closeModal: this.closeModal,
      });
    }
  }

  openModal = event => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.setState({ modalIsOpen: true });
    if (this.props.openStateChanged) {
      this.props.openStateChanged(true);
    }
  };

  closeModal = event => {
    if (event) {
      event.stopPropagation();
    }
    this.setState({ modalIsOpen: false });
    if (this.props.openStateChanged) {
      this.props.openStateChanged(false);
    }
  };

  render() {
    const {
      className,
      dialogClassName,
      dialogOverflow,
      showCloseButton,
      dontWrapDialogContent,
      dialogProperties, // deprecated
      dialogProps,
      labelId,
      component,
      trigger,
      titleId,
      type,
      children,
      contentComponent,
      contentProps,
      classes,
    } = this.props;

    if (dialogProperties) {
      deprecate('1.15.2', 'ModalTrigger’s "dialogProperties" prop has been renamed "dialogProps"');
    }

    const intl = this.context.intl;

    const label = labelId ? intl.formatMessage({ id: labelId }) : this.props.label;
    const title = titleId ? intl.formatMessage({ id: titleId }) : this.props.title;

    const triggerComponent =
      (component || trigger)
        ?
        instantiateComponent(component || trigger, {
          onClick: this.openModal,
          className: classNames('modal-trigger', classes.root, className),
        })
        :
        type === 'button'
          ?
          <Button
            className={classNames('modal-trigger', classes.root, classes.button, className)}
            variant="contained"
            onClick={this.openModal}>
            {label}
          </Button>
          :
          <a className={classNames('modal-trigger', classes.root, classes.anchor, className)} href="#"
             onClick={this.openModal}>
            {label}
          </a>;

    return (
      <>
        {triggerComponent}
        <Components.Modal
          className={dialogClassName}
          show={this.state.modalIsOpen}
          onHide={this.closeModal}
          title={title}
          dialogOverflow={dialogOverflow}
          showCloseButton={showCloseButton}
          dontWrapDialogContent={dontWrapDialogContent}
          classes={_omit(classes, ['root', 'button', 'anchor'])}
          dialogProps={{ ...dialogProperties, ...dialogProps }}
        >
          {
            !this.state.modalIsOpen
              ?
              null
              :
              contentComponent
                ?
                instantiateComponent(contentComponent, contentProps)
                :
                children
          }
        </Components.Modal>
      </>
    );
  }

}

ModalTrigger.propTypes = {
  /**
   * Callback fired when the component mounts.
   * This is useful when you want to trigger an action programmatically.
   * It supports `openModal()` and `closeModal()`.
   *
   * @param {object} actions This object contains all possible actions
   * that can be triggered programmatically.
   */
  action: PropTypes.func,
  className: PropTypes.string,
  dialogClassName: PropTypes.string,
  dialogOverflow: PropTypes.bool,
  showCloseButton: PropTypes.bool,
  dontWrapDialogContent: PropTypes.bool,
  dialogProperties: PropTypes.object, // deprecated — use dialogProps
  dialogProps: PropTypes.object,
  label: PropTypes.string,
  labelId: PropTypes.string,
  component: PropTypes.object,
  trigger: PropTypes.object,
  title: PropTypes.node,
  titleId: PropTypes.string,
  type: PropTypes.oneOf(['link', 'button']),
  openStateChanged: PropTypes.func,
  children: PropTypes.node,
  contentComponent: PropTypes.oneOfType([PropTypes.node, PropTypes.elementType]),
  contentProps: PropTypes.object,
  classes: PropTypes.object,
};

ModalTrigger.contextTypes = {
  intl: intlShape,
};

registerComponent('ModalTrigger', ModalTrigger, [withStyles, styles]);
