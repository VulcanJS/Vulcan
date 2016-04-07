import React, { PropTypes, Component } from 'react';
import FRC from 'formsy-react-components';
const Input = FRC.Input;

class PrefilledTitle extends Component {

  // will trigger every time props, state, or context change
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    
    // get current context's prefilled title (if it exists)
    const nextTitle = nextContext.prefilledValues && nextContext.prefilledValues.title;
    // get next context's prefilled title (if it exists)
    const currentTitle = this.context.prefilledValues && this.context.prefilledValues.title;

    // if prefilled title has changed *and* title input field is empty, 
    // then update field with new value
    if (!!nextTitle && nextTitle != currentTitle && !this.input.getValue()) {
      this.input.setValue(nextTitle);
    }

    // proceed with component update
    return true;
  }

  render() {
    const {name, value, label} = this.props;
    return <Input name={name} value={value} label={label} type="text"  ref={(ref) => this.input = ref}/>;
  }
}

PrefilledTitle.propTypes = {
  name: React.PropTypes.string,
  value: React.PropTypes.any,
  label: React.PropTypes.string
}

PrefilledTitle.contextTypes = {
  prefilledValues: React.PropTypes.object
}

export default PrefilledTitle;