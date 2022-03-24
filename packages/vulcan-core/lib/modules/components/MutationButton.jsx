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
  submitCallback={() => {}}
  successCallback={result => { console.log(result) }}
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
    const { mutationOptions, submitCallback, successCallback, errorCallback } = this.props;
    let { mutationArguments } = this.props;
    const mutationName = mutationOptions.name;
    const mutation = this.props[mutationName];

    try {
      if (submitCallback) {
        const callbackReturn = await submitCallback(mutationArguments);
        if (callbackReturn?.mutationArguments) {
          mutationArguments = callbackReturn.mutationArguments;
        }
      }
      const result = await mutation(mutationArguments);
      this.setState({ loading: false });
      if (successCallback) {
        await successCallback(result);
      }
    } catch (error) {
      this.setState({ loading: false, error });
      if (errorCallback) {
        await errorCallback(error);
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

    // note: the div wrapping trigger is needed so that the tooltip coordinates
    // can be properly calculated

    if (error) {
      return (
        <Components.TooltipTrigger trigger={<div style={{ display: 'inline-block' }}>{loadingButton}</div>} show={true} defaultShow={true}>
          {error.message.replace('GraphQL error: ', '')}
        </Components.TooltipTrigger>
      );
    }
    return loadingButton;
  }
}

registerComponent('MutationButton', MutationButton);
export default MutationButton;
