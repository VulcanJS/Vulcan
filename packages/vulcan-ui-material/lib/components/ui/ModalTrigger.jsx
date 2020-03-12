import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'meteor/vulcan:i18n';
import { Components, registerComponent } from 'meteor/vulcan:core';
import withStyles from '@material-ui/core/styles/withStyles';
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
  
  constructor (props) {
    super(props);
    
    this.state = { modalIsOpen: false };
  }
  
  componentDidMount () {
    if (this.props.action) {
      this.props.action({
        openModal: this.openModal,
        closeModal: this.closeModal,
      });
    }
  }
  
  openModal = (event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.setState({ modalIsOpen: true });
    if (this.props.openStateChanged) {
      this.props.openStateChanged(true);
    }
  };
  
  closeModal = (event) => {
    if (event) {
      event.stopPropagation();
    }
    this.setState({ modalIsOpen: false });
    if (this.props.openStateChanged) {
      this.props.openStateChanged(false);
    }
  };
  
  render () {
    const {
      className,
      dialogClassName,
      dialogOverflow,
      showCloseButton,
      dialogProperties,
      dialogProps,
      labelId,
      component,
      trigger,
      titleId,
      type,
      children,
      classes,
    } = this.props;
    
    const intl = this.context.intl;
    
    const label = labelId ? intl.formatMessage({ id: labelId }) : this.props.label;
    const title = titleId ? intl.formatMessage({ id: titleId }) : this.props.title;
    
    const triggerComponent = component || trigger
      ?
      <span onClick={this.openModal} className={classNames('modal-trigger', classes.root, className)}>
        {component || trigger}
      </span>
// Ideal pattern 
// React.cloneElement(component || trigger, {
//   className: classNames('modal-trigger', classes.root, className),
//   onClick: this.openModal
// })
      :
      type === 'button'
        ?
        <Button className={classNames('modal-trigger', classes.root, classes.button, className)}
                variant="contained"
                onClick={this.openModal}
        >{label}</Button>
        :
        <a className={classNames('modal-trigger', classes.root, classes.anchor, className)}
           href="#"
           onClick={this.openModal}
        >{label}</a>;
    
    const childrenComponent = typeof children.type === 'function' ?
      React.cloneElement(children, { closeModal: this.closeModal }) :
      children;
    
    return (
      <>
        {triggerComponent}
        <Components.Modal className={dialogClassName}
                          show={this.state.modalIsOpen}
                          onHide={this.closeModal}
                          title={title}
                          dialogOverflow={dialogOverflow}
                          showCloseButton={showCloseButton}
                          classes={_omit(classes, ['root', 'button', 'anchor'])}
                          dialogProps={{ ...dialogProperties, ...dialogProps }}
        >
          {childrenComponent}
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
  dialogProperties: PropTypes.object, // deprecated
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
  classes: PropTypes.object,
};


ModalTrigger.contextTypes = {
  intl: intlShape,
};


registerComponent('ModalTrigger', ModalTrigger, [withStyles, styles]);
