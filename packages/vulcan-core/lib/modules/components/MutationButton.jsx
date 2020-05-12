/*

Example Usage

<Components.MutationButton
  label="Cancel Subscription"
  variant="primary"
  mutationOptions={{
    name: 'cancelSubscription',
    args: { bookingId: 'String' },
    fragmentName: 'BookingsStripeDataFragment',
  }}
  mutationArguments={{ bookingId: booking._id }}
/>

*/
import React, { PureComponent } from 'react';
import { Components, registerComponent } from 'meteor/vulcan:lib';
import withMutation from '../containers/registeredMutation';

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
    error: null,
  };

  handleClick = async e => {
    e.preventDefault();
    this.setState({ loading: true, error: null });
    const { mutationOptions, mutationArguments, submitCallback, successCallback, errorCallback } = this.props;
    const mutationName = mutationOptions.name;
    const mutation = this.props[mutationName];

    try {
      if (submitCallback) {
        submitCallback();
      }
      const result = await mutation(mutationArguments);
      this.setState({ loading: false });
      if (successCallback) {
        successCallback(result);
      }
    } catch (error) {
      this.setState({ loading: false, error });
      if (errorCallback) {
        errorCallback(error);
      }
    }

    // mutation(mutationArguments)
    //   .then(result => {
    //     this.setState({ loading: false });
    //     if (successCallback) {
    //       successCallback(result);
    //     }
    //   })
    //   .catch(error => {
    //     this.setState({ loading: false });
    //     if (errorCallback) {
    //       errorCallback(error);
    //     }
    //   });
  };

  render() {
    const { loading, error } = this.state;
    const mutationName = this.props.mutationOptions.name;

    const { label, ...rest } = this.props;
    delete rest[mutationName];
    delete rest.mutationOptions;
    delete rest.mutationArguments;
    delete rest.successCallback;
    delete rest.errorCallback;
    delete rest.submitCallback;

    const loadingButton = <Components.LoadingButton loading={loading} onClick={this.handleClick} label={label} {...rest} />;

    if (error) {
      return (
        <Components.TooltipTrigger trigger={loadingButton} defaultShow={true}>
          {error.message.replace('GraphQL error: ', '')}
        </Components.TooltipTrigger>
      );
    }
    return loadingButton;
  }
}

registerComponent('MutationButton', MutationButton);
export default MutationButton;
