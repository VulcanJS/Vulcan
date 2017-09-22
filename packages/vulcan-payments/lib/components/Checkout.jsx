import React from 'react'
import StripeCheckout from 'react-stripe-checkout';
import { Components, registerComponent, getSetting, registerSetting, withCurrentUser, withMessages } from 'meteor/vulcan:core';
import Users from 'meteor/vulcan:users';
import { intlShape } from 'meteor/vulcan:i18n';
import classNames from 'classnames';
import withCreateCharge from '../containers/withCreateCharge.js';
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

  onToken(token) {

    const {createChargeMutation, productKey, associatedCollection, associatedDocument, callback, properties, currentUser, flash, coupon} = this.props;

    this.setState({ loading: true });

    const args = {
      token, 
      userId: currentUser._id, 
      productKey,
      associatedCollection: associatedCollection._name,
      associatedId: associatedDocument._id,
      properties,
      coupon,
    }

    createChargeMutation(args).then(response => {

      // not needed because we just unmount the whole component:
      this.setState({ loading: false });

      if (callback) {
        callback(response);
      }else{
        flash(this.context.intl.formatMessage({id: 'payments.payment_succeeded'}), 'success');
      }
    
    }).catch(error => {
    
      console.log(error)
      flash(this.context.intl.formatMessage({id: 'payments.error'}), 'error');
    
    });

  }

  render() {

    const {productKey, currentUser, button, coupon} = this.props;
  
    const sampleProduct = {
      amount: 10000,
      name: 'My Cool Product',
      description: 'This product is awesome.',
      currency: 'USD',
    }

    // get the product from Products (either object or function applied to doc)
    // or default to sample product
    const definedProduct = Products[productKey];
    const product = typeof definedProduct === 'function' ? definedProduct(this.props.associatedDocument) : definedProduct || sampleProduct;

    let amount = product.amount;

    if (coupon && product.coupons && product.coupons[coupon]) {
      amount -= product.coupons[coupon];
    }

    return (
      <div className={classNames('stripe-checkout', {'checkout-loading': this.state.loading})}>
        <StripeCheckout
          token={this.onToken}
          stripeKey={Meteor.isDevelopment ? stripeSettings.publishableKeyTest : stripeSettings.publishableKey}
          ComponentClass="div"
          name={product.name}
          description={product.description}
          amount={amount}
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
    )
  }
}

Checkout.contextTypes = {
  intl: intlShape
};

const WrappedCheckout = (props) => {
  const { fragment, fragmentName } = props;
  const WrappedCheckout = withCreateCharge({fragment, fragmentName})(Checkout);
  return <WrappedCheckout {...props}/>;
}

registerComponent('Checkout', WrappedCheckout, withCurrentUser, withMessages);

export default WrappedCheckout;