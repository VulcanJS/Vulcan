import React, { PureComponent } from 'react';
import { Components, registerComponent } from 'meteor/vulcan:lib';
import withMutation from '../containers/withMutation';

class MutationButtonWrapper extends PureComponent {
  constructor(props) {
    super(props);
    this.button = withMutation(props.mutationOptions)(MutationButton);
  }

  render() {
    const Component = this.button;
    return <Component {...this.props} />;
  }
}

class MutationButton extends PureComponent {

  state = {
    loading: false,
  };

  handleClick = e => {
    e.preventDefault();
    this.setState({ loading: true });
    const mutationName = this.props.mutationOptions.name;
    const mutation = this.props[mutationName];
    mutation(this.props.arguments).then(result => {
      this.setState({ loading: false });
      if(this.props.successCallback) {
        this.props.successCallback(result);
      }
    }).catch(error => {
      if(this.props.errorCallback) {
        this.props.errorCallback(error);
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
      <Components.Button onClick={this.handleClick} {...rest}>
        <span style={wrapperStyle}>
          <span style={labelStyle}>{label}</span>
          <span style={loadingStyle}><Components.Loading/></span>
        </span>
      </Components.Button>
    );
  }
}

registerComponent('MutationButton', MutationButtonWrapper);
