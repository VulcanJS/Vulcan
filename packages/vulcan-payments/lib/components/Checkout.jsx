import React from 'react';
import PropTypes from 'prop-types';
import StripeCheckout from 'react-stripe-checkout';
import { Components, registerComponent, getSetting, withCurrentUser, withMessages } from 'meteor/vulcan:core';
import Users from 'meteor/vulcan:users';
import classNames from 'classnames';
import withPaymentAction from '../containers/withPaymentAction.js';
import { Products } from '../modules/products.js';

const stripeSettings = getSetting('stripe');

class Checkout extends React.Component {

  constructor() {
    super();
    this.onToken = this.onToken.bind(this);
    this.state = {
      loading: false,
      mounted: false
    };
  }

  handleOpen = () => {
    if (this.props.onClick) {
      this.props.onClick();
    }
  }
  
  onToken(token) {

    const {paymentActionMutation, productKey, associatedCollection, associatedDocument, callback, successCallback, errorCallback, properties, currentUser, flash, coupon} = this.props;

    this.setState({ loading: true });

    const args = {
      token, 
      userId: currentUser._id, 
      productKey,
      associatedCollection: associatedCollection._name,
      associatedId: associatedDocument._id,
      properties,
      coupon,
    };

    paymentActionMutation(args).then(response => {

      // not needed because we just unmount the whole component:
      this.setState({ loading: false });

      // support both names for backwards compatibility
      const callbackFunction = successCallback || callback;
      if (callbackFunction) {
        callbackFunction(response);
      }else{
        flash({id: 'payments.payment_succeeded', type: 'success'});
      }
    
    }).catch(error => {

      // eslint-disable-next-line no-console
      console.log(error);
      if (errorCallback) {
        errorCallback(error);
      } else {
        flash({message: error.message, type: 'error'});
      }
    });

  }

  render() {

    const { productKey, currentUser, button, coupon, associatedDocument, customAmount } = this.props;
  
    const sampleProduct = {
      amount: 10000,
      name: 'My Cool Product',
      description: 'This product is awesome.',
      currency: 'USD',
    };

    // get the product from Products (either object or function applied to doc)
    // or default to sample product
    const definedProduct = Products[productKey];
    const product = typeof definedProduct === 'function' ? definedProduct(associatedDocument) : definedProduct || sampleProduct;

    // if product has initial amount, use it  (for subscription products)
    let checkoutAmount = customAmount || ( product.initialAmount ? product.initialAmount + product.amount : product.amount );

    if (coupon && product.coupons && product.coupons[coupon]) {
      checkoutAmount -= product.coupons[coupon];
    }

    return (
      <div className={classNames('stripe-checkout', {'checkout-loading': this.state.loading})}>
        <StripeCheckout
          opened={this.handleOpen}
          token={this.onToken}
          stripeKey={Meteor.isDevelopment || stripeSettings.alwaysUseTest ? stripeSettings.publishableKeyTest : stripeSettings.publishableKey}
          ComponentClass="div"
          name={product.name}
          description={product.description}
          amount={checkoutAmount}
          currency={product.currency}
          email={Users.getEmail(currentUser)}
          allowRememberMe
          >
          {button ? button :
            <button className="btn btn-primary">
              Buy
            </button>
          }
        </StripeCheckout>
        {this.state.loading ? <Components.Loading /> : null}
      </div>
    );
  }
}

Checkout.propTypes = {
  productKey: PropTypes.string,
  currentUser: PropTypes.object, 
  button: PropTypes.object, 
  coupon: PropTypes.string,
  associatedDocument: PropTypes.object,
  customAmount: PropTypes.number,
  onClick: PropTypes.func,
};

const WrappedCheckout = (props) => {
  const { fragment, fragmentName } = props;
  const WrappedCheckout = withPaymentAction({fragment, fragmentName})(Checkout);
  return <WrappedCheckout {...props}/>;
};

registerComponent('Checkout', WrappedCheckout, withCurrentUser, withMessages);

export default WrappedCheckout;