import React, { PropTypes, Component } from 'react';
import FRC from 'formsy-react-components';
const Textarea = FRC.Textarea;

class PrefilledBody extends Component {

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    
    const nextBody = nextContext.prefilledValues && nextContext.prefilledValues.body;
    const currentBody = this.context.prefilledValues && this.context.prefilledValues.body;

    if (!!nextBody && nextBody != currentBody && !this.input.getValue()) {
      this.input.setValue(nextBody);
    }

    return true;
  }

  render() {
    const {name, value, label} = this.props;
    return <Textarea name={name} value={value} label={label} ref={(ref) => this.input = ref}/>;
  }
}

PrefilledBody.propTypes = {
  name: React.PropTypes.string,
  value: React.PropTypes.any,
  label: React.PropTypes.string
}

PrefilledBody.contextTypes = {
  prefilledValues: React.PropTypes.object
}

export default PrefilledBody;