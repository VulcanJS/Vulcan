import React, { PureComponent } from 'react';
import { Components, registerComponent } from 'meteor/vulcan:lib';
import withMutation from '../containers/withMutation';

class MutationButton extends PureComponent {
  constructor(props) {
    super(props);
    this.button = withMutation(props.mutationOptions)(MutationButtonInner);
  }

  render() {
    const Component = this.button;
    return <Component {...this.props} />;
  }
}

class MutationButtonInner extends PureComponent {

  state = {
    loading: false,
  };

  handleClick = e => {
    e.preventDefault();
    this.setState({ loading: true });
    const { mutationOptions, mutationArguments, successCallback, errorCallback } = this.props;
    const mutationName = mutationOptions.name;
    const mutation = this.props[mutationName];
    mutation(mutationArguments).then(result => {
      this.setState({ loading: false });
      if(successCallback) {
        successCallback(result);
      }
    }).catch(error => {
      this.setState({ loading: false });
      if(errorCallback) {
        errorCallback(error);
      }
    });
  };

  render() {
    const { loading } = this.state;
    const mutationName = this.props.mutationOptions.name;

    const { label, ...rest } = this.props;
    delete rest[mutationName];
    delete rest.mutationOptions;
    delete rest.mutationArguments;
    delete rest.successCallback;
    delete rest.errorCallback;

    return <Components.LoadingButton loading={loading} onClick={this.handleClick} label={label} {...rest}/>;
  }
}

registerComponent('MutationButton', MutationButton);

const LoadingButton = ({ loading, label, onClick, children, ...rest }) => {

  const wrapperStyle = {
    position: 'relative',
  };

  const labelStyle = loading ? { opacity: 0.5 } : {};

  const loadingStyle = loading ? {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  } : { display: 'none'};

  return (
    <Components.Button onClick={onClick} {...rest}>
      <span style={wrapperStyle}>
        <span style={labelStyle}>{label || children}</span>
        <span style={loadingStyle}><Components.Loading/></span>
      </span>
    </Components.Button>
  );
};

registerComponent('LoadingButton', LoadingButton);
