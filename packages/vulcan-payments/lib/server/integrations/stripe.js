/*

Stripe charge lifecycle

### From a GraphQL Mutation ###

1. paymentActionMutation GraphQL mutation is received

2. receiveAction is called

  -> [stripe.receive.sync] callback on metadata object
  -> [stripe.receive.async] callback

| for one-time charges

3. createCharge is called

  -> [stripe.charge.async] callback

| for subscriptions

3. createSubscription is called

  -> [stripe.subscribe.async] callback

4. processAction is called

  -> [stripe.process.sync] callback
  -> [stripe.process.async] callback

### From a Stripe Webhook ###

1. `/stripe` endpoint is triggered

2. processAction is called

*/

import {
  webAppConnectHandlersUse,
  debug,
  debugGroup,
  debugGroupEnd,
  getSetting,
  registerSetting,
  createMutator,
  updateMutator,
  Collections,
  registerCallback,
  runCallbacks,
  runCallbacksAsync,
  Connectors,
} from 'meteor/vulcan:core';
import express from 'express';
import Stripe from 'stripe';
import Charges from '../../modules/charges/collection.js';
import Users from 'meteor/vulcan:users';
import { Products } from '../../modules/products.js';
import { Promise } from 'meteor/promise';

registerSetting('stripe', null, 'Stripe settings');
registerSetting('stripe.publishableKey', null, 'Publishable key', true);
registerSetting('stripe.publishableKeyTest', null, 'Publishable key (test)', true);
registerSetting('stripe.secretKey', null, 'Secret key');
registerSetting('stripe.secretKeyTest', null, 'Secret key (test)');
registerSetting('stripe.endpointSecret', null, 'Endpoint secret for webhook');
registerSetting('stripe.alwaysUseTest', false, 'Always use test keys in all environments', true);

const stripeSettings = getSetting('stripe');

// initialize Stripe
const keySecret =
  Meteor.isDevelopment || stripeSettings && stripeSettings.alwaysUseTest
    ? stripeSettings && stripeSettings.secretKeyTest
    : stripeSettings && stripeSettings.secretKey;
export const stripe = new Stripe(keySecret);

const sampleProduct = {
  amount: 10000,
  name: 'My Cool Product',
  description: 'This product is awesome.',
  currency: 'USD',
};

/*

Receive the action and call the appropriate handler

*/
export const receiveAction = async (args, context) => {
  let collection,
    document,
    returnDocument = {};

  const { userId, productKey, associatedCollection, associatedId, properties } = args;

  if (!stripeSettings) {
    throw new Error('Please fill in your Stripe settings');
  }

  // if an associated collection name and document id have been provided,
  // get the associated collection and document
  if (associatedCollection && associatedId) {
    collection = _.findWhere(Collections, { _name: associatedCollection });
    document = await Connectors.get(collection, associatedId);
  }

  // get the product from Products (either object or function applied to doc)
  // or default to sample product
  const definedProduct = Products[productKey];
  const product =
    typeof definedProduct === 'function'
      ? definedProduct(document)
      : definedProduct || sampleProduct;

  // get the user performing the transaction
  const user = await Connectors.get(Users, userId);

  // create metadata object
  let metadata = {
    userId: userId,
    userName: Users.getDisplayName(user),
    userProfile: Users.getProfileUrl(user, true),
    productKey,
    ...properties,
  };

  if (associatedCollection && associatedId) {
    metadata.associatedCollection = associatedCollection;
    metadata.associatedId = associatedId;
  }

  metadata = await runCallbacks('stripe.receive.sync', metadata, {
    user,
    product,
    collection,
    document,
    args,
    context,
  });

  if (product.type === 'subscription') {
    // if product is a subscription product, subscribe user to its plan
    returnDocument = await createSubscription({
      user,
      product,
      collection,
      document,
      metadata,
      args,
      context,
    });
  } else {
    // else, perform charge
    returnDocument = await createCharge({
      user,
      product,
      collection,
      document,
      metadata,
      args,
      context,
    });
  }

  runCallbacks('stripe.receive.async', {
    metadata,
    user,
    product,
    collection,
    document,
    args,
    context,
  });
  return returnDocument;
};

/*

Update/retrieve or create a Stripe customer

*/
export const getCustomer = async (user, token) => {
  const { id } = token;

  let customer;
  const customerOptions = {};
  if (id) {
    customerOptions.source = id;
  }

  try {
    // update customer with latest payment source and get customer object in return (if it exists)
    customer = await stripe.customers.update(user.stripeCustomerId, customerOptions);
  } catch (error) {
    // if user doesn't have a stripeCustomerId; or if id doesn't match up with Stripe, create new customer object
    customerOptions.email = user.email;
    customer = await stripe.customers.create(customerOptions);

    // add stripe customer id to user object
    await updateMutator({
      collection: Users,
      documentId: user._id,
      data: { stripeCustomerId: customer.id },
      validate: false,
    });
  }

  return customer;
};

/*

Create one-time charge. 

*/
export const createCharge = async ({
  user,
  product,
  collection,
  document,
  metadata,
  args,
  context,
}) => {
  const { token, /* userId, productKey, associatedId, properties, */ coupon } = args;

  const customer = await getCustomer(user, token);

  let amount = product.amount;

  // apply discount coupon and add it to metadata, if there is one
  if (coupon && product.coupons && product.coupons[coupon]) {
    amount -= product.coupons[coupon];
    metadata.coupon = coupon;
    metadata.discountAmount = product.coupons[coupon];
  }

  // gather charge data
  const chargeData = {
    amount,
    description: product.description,
    currency: product.currency,
    customer: customer.id,
    metadata,
  };

  // create Stripe charge
  const charge = await stripe.charges.create(chargeData);

  charge.objectType = 'charge';

  runCallbacksAsync('stripe.charge.async', {
    charge,
    collection,
    document,
    args,
    user,
    context,
  });

  return processAction({
    collection,
    document,
    stripeObject: charge,
    args,
    user,
    context,
  });
};

/*

Subscribe a user to a Stripe plan

*/
export const createSubscription = async ({
  user,
  product,
  collection,
  document,
  metadata,
  args,
  context,
}) => {
  let returnDocument = document;

  let invoiceItemId;

  try {
    const customer = await getCustomer(user, args.token);
    // if product has an initial cost,
    // create an invoice item and attach it to the customer first
    // see https://stripe.com/docs/subscriptions/invoices#adding-invoice-items
    if (product.initialAmount) {
      // eslint-disable-next-line no-unused-vars
      const initialInvoiceItem = await stripe.invoiceItems.create({
        customer: customer.id,
        amount: product.initialAmount,
        currency: product.currency,
        description: product.initialAmountDescription,
      });
      invoiceItemId = initialInvoiceItem.id;
    }

    // eslint-disable-next-line no-unused-vars
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ plan: product.plan }],
      metadata,
      ...product.subscriptionProperties,
    });

    subscription.objectType = 'subscription';

    // // if an associated collection and id have been provided,
    // // update the associated document
    // if (collection && document) {

    //   let modifier = {
    //     $set: {},
    //     $unset: {}
    //   }

    //   // run collection.subscribe.sync callbacks
    //   modifier = runCallbacks(`${collection._name}.subscribe.sync`, modifier, document, subscription, user);

    //   returnDocument = await editMutation({
    //     collection,
    //     documentId: document._id,
    //     set: modifier.$set,
    //     unset: modifier.$unset,
    //     validate: false
    //   });

    //   returnDocument.__typename = collection.typeName;

    // }

    runCallbacksAsync('stripe.subscribe.async', {
      subscription,
      collection,
      returnDocument,
      args,
      user,
      context,
    });

    returnDocument = await processAction({
      collection,
      document,
      stripeObject: subscription,
      args,
      user,
      context,
    });

    return returnDocument;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('// Stripe createSubscription error');
    // eslint-disable-next-line no-console
    console.log(error);
    /*

    If an invoice item was created, cancel it to avoid having invoice items
    pile up and be charged during future payment attempts.

    */
    if (invoiceItemId) {
      try {
        await stripe.invoiceItems.del(invoiceItemId);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(`// Error while attempting to delete invoice item ID ${invoiceItemId}`);
        // eslint-disable-next-line no-console
        console.log(error);
        throw error;
      }
    }
    runCallbacksAsync('stripe.error.async', {
      action: 'subscription',
      collection,
      returnDocument,
      args,
      user,
      context,
    });
    throw error;
  }
};

// create a stripe plan
// plan is used as the unique ID and is not needed for creating a plan
const createPlan = async ({
  // Extract all the known properties for the stripe api
  // Evertying else goes in the metadata field
  plan: id,
  currency,
  interval,
  name,
  amount,
  interval_count,
  statement_descriptor,
  context,
  ...metadata
}) =>
  stripe.plans.create({
    id,
    currency,
    interval,
    amount,
    interval_count,
    product: {
      name,
      statement_descriptor,
      metadata,
    },
    metadata,
  });

export const createSubscriptionPlan = async maybePlanObject =>
  typeof maybePlanObject === 'object' && createPlan(maybePlanObject);
const retrievePlan = async planObject => stripe.plans.retrieve(planObject.plan);
export const retrieveSubscriptionPlan = async maybePlanObject =>
  typeof maybePlanObject === 'object' && retrievePlan(maybePlanObject);
const createOrRetrievePlan = async planObject => {
  return retrievePlan(planObject).catch(error => {
    // Plan does not exist, create it
    if (error.statusCode === 404) {
      // eslint-disable-next-line no-console
      console.log(
        `Creating subscription plan ${planObject.plan} for ${(planObject.amount &&
          (planObject.amount / 100).toLocaleString('en-US', {
            style: 'currency',
            currency: planObject.currency,
          })) ||
          'free'}`
      );
      return createPlan(planObject);
    }
    // Something else went wrong
    // eslint-disable-next-line no-console
    console.error(error);
    throw error;
  });
};
export const createOrRetrieveSubscriptionPlan = async maybePlanObject =>
  typeof maybePlanObject === 'object' && createOrRetrievePlan(maybePlanObject);

/*

Process charges, subscriptions, etc. on Vulcan's side

*/
export const processAction = async ({
  collection,
  document,
  stripeObject,
  args,
  user,
  context,
}) => {
  debug('');
  debugGroup('--------------- start\x1b[35m processAction \x1b[0m ---------------');
  debug(`Collection: ${collection.options.collectionName}`);
  debug(`documentId: ${document._id}`);
  debug(`Charge: ${stripeObject}`);

  let returnDocument = {};

  // make sure charge hasn't already been processed
  // (could happen with multiple endpoints listening)

  const existingCharge = await Connectors.get(Charges, {
    'data.id': stripeObject.id,
  });

  if (existingCharge) {
    // eslint-disable-next-line no-console
    console.log(
      `// Charge with Stripe id ${stripeObject.id} already exists in db; aborting processAction`
    );
    return collection && document ? document : {};
  }

  const {
    token,
    userId,
    productKey,
    associatedCollection,
    associatedId,
    properties,
    livemode,
  } = args;

  // create charge document for storing in our own Charges collection
  const chargeDoc = {
    createdAt: new Date(),
    userId,
    type: stripeObject.objectType,
    source: 'stripe',
    test: !livemode,
    data: stripeObject,
    associatedCollection,
    associatedId,
    properties,
    productKey,
  };

  if (token) {
    chargeDoc.tokenId = token.id;
    chargeDoc.test = !token.livemode; // get livemode from token if provided
    chargeDoc.ip = token.client_ip;
  }
  // insert
  const chargeSavedData = await createMutator({
    collection: Charges,
    data: chargeDoc,
    validate: false,
  });
  const chargeSaved = chargeSavedData.data;

  // if an associated collection and id have been provided,
  // update the associated document
  if (collection && document) {
    // note: assume a single document can have multiple successive charges associated to it
    const chargeIds = document.chargeIds
      ? [...document.chargeIds, chargeSaved._id]
      : [chargeSaved._id];

    let data = { chargeIds };

    // run collection.charge.sync callbacks
    data = await runCallbacks({
      name: 'stripe.process.sync',
      iterator: data,
      properties: { collection, document, chargeDoc, user },
    });

    context.event = 'stripe.process.sync';
    context.chargeDoc = chargeDoc;

    const updateResult = await updateMutator({
      collection,
      documentId: associatedId,
      data,
      validate: false,
      context,
    });

    returnDocument = updateResult.data;

    returnDocument.__typename = collection.typeName;
  }

  runCallbacksAsync('stripe.process.async', {
    collection,
    returnDocument,
    chargeDoc,
    user,
    context,
  });

  debugGroupEnd();
  debug('--------------- end\x1b[35m processAction \x1b[0m ---------------');
  debug('');

  return returnDocument;
};

/*

Webhooks with Express

*/

// see https://github.com/stripe/stripe-node/blob/master/examples/webhook-signing/express.js

const app = express();

// Add the raw text body of the request to the `request` object
function addRawBody(req, res, next) {
  req.setEncoding('utf8');

  var data = '';

  req.on('data', function(chunk) {
    data += chunk;
  });

  req.on('end', function() {
    req.rawBody = data;

    next();
  });
}

app.post('/stripe', addRawBody, async function(req, res) {
  // eslint-disable-next-line no-console
  console.log('////////////// stripe webhook');

  const sig = req.headers['stripe-signature'];

  try {
    const event = stripe.webhooks.constructEvent(req.rawBody, sig, stripeSettings.endpointSecret);

    // eslint-disable-next-line no-console
    console.log('event ///////////////////');
    // eslint-disable-next-line no-console
    console.log(event);

    switch (event.type) {
      case 'charge.succeeded':
        // eslint-disable-next-line no-console
        console.log('////// charge succeeded');

        const charge = event.data.object;

        charge.objectType = 'charge';

        // eslint-disable-next-line no-console
        console.log(charge);

        try {
          // look up corresponding invoice
          const invoice = await stripe.invoices.retrieve(charge.invoice);
          // eslint-disable-next-line no-console
          console.log('////// invoice');
          // eslint-disable-next-line no-console
          console.log(invoice);

          // look up corresponding subscription
          const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
          // eslint-disable-next-line no-console
          console.log('////// subscription');
          // eslint-disable-next-line no-console
          console.log(subscription);

          const { userId, productKey, associatedCollection, associatedId } = subscription.metadata;

          if (associatedCollection && associatedId) {
            const collection = _.findWhere(Collections, {
              _name: associatedCollection,
            });
            const document = await Connectors.get(collection, associatedId);

            // make sure document actually exists
            if (!document) {
              throw new Error(
                `Could not find ${associatedCollection} document with id ${associatedId} associated with subscription id ${
                  subscription.id
                }; Not processing charge.`
              );
            }

            const args = {
              userId,
              productKey,
              associatedCollection,
              associatedId,
              livemode: subscription.livemode,
            };

            processAction({ collection, document, stripeObject: charge, args });
          }
        } catch (error) {
          // eslint-disable-next-line no-console
          console.log('// Stripe webhook error');
          // eslint-disable-next-line no-console
          console.log(error);
        }

        break;
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('///// Stripe webhook error');
    // eslint-disable-next-line no-console
    console.log(error);
  }

  res.sendStatus(200);
});

webAppConnectHandlersUse(Meteor.bindEnvironment(app), {
  name: 'stripe_endpoint',
  order: 100,
});

// Picker.middleware(bodyParser.json());

// Picker.route('/stripe', async function(params, req, res, next) {

//   console.log('////////////// stripe webhook')

//   console.log(req)
//   const sig = req.headers['stripe-signature'];
//   const body = req.body;

//   console.log('sig ///////////////////')
//   console.log(sig)

//   console.log('body ///////////////////')
//   console.log(body)

//   console.log('rawBody ///////////////////')
//   console.log(req.rawBody)

//   try {
//     const event = stripe.webhooks.constructEvent(req.rawBody, sig, stripeSettings.endpointSecret);
//     console.log('event ///////////////////')
//     console.log(event)
//   } catch (error) {
//     console.log('///// Stripe webhook error')
//     console.log(error)
//   }

//    // Retrieve the request's body and parse it as JSON
//    switch (body.type) {

//     case 'charge.succeeded':

//       console.log('////// charge succeeded')
//       // console.log(body)

//       const charge = body.data.object;

//       try {

//         // look up corresponding invoice
//         const invoice = await stripe.invoices.retrieve(body.data.object.invoice);
//         console.log('////// invoice')

//         // look up corresponding subscription
//         const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
//         console.log('////// subscription')
//         console.log(subscription)

//         const { userId, productKey, associatedCollection, associatedId } = subscription.metadata;

//         if (associatedCollection && associatedId) {
//           const collection = _.findWhere(Collections, {_name: associatedCollection});
//           const document = collection.findOne(associatedId);

//           const args = {
//             userId,
//             productKey,
//             associatedCollection,
//             associatedId,
//             livemode: subscription.livemode,
//           }

//           processAction({ collection, document, charge, args});

//         }
//       } catch (error) {
//         console.log('// Stripe webhook error')
//         console.log(error)
//       }

//       break;

//    }

//   res.statusCode = 200;
//   res.end();

// });

Meteor.startup(() => {
  registerCallback({
    name: 'stripe.receive.sync',
    description: "Modify any metadata before calling Stripe's API",
    arguments: [
      { metadata: 'Metadata about the action' },
      { user: 'The user' },
      { product: 'Product created with addProduct' },
      { collection: 'Associated collection of the charge' },
      { document: 'Associated document in collection to the charge' },
      { args: 'Original mutation arguments' },
    ],
    runs: 'sync',
    newSyntax: true,
    returns: 'The modified metadata to be sent to Stripe',
  });

  registerCallback({
    name: 'stripe.receive.async',
    description: "Run after calling Stripe's API",
    arguments: [
      { metadata: 'Metadata about the charge' },
      { user: 'The user' },
      { product: 'Product created with addProduct' },
      { collection: 'Associated collection of the charge' },
      { document: 'Associated document in collection to the charge' },
      { args: 'Original mutation arguments' },
    ],
    runs: 'sync',
    newSyntax: true,
  });

  registerCallback({
    name: 'stripe.charge.async',
    description: 'Perform operations immediately after the stripe subscription has completed',
    arguments: [
      { charge: 'The charge' },
      { collection: 'Associated collection of the subscription' },
      { document: 'Associated document in collection to the charge' },
      { args: 'Original mutation arguments' },
      { user: 'The user' },
    ],
    runs: 'async',
    newSyntax: true,
  });

  registerCallback({
    name: 'stripe.subscribe.async',
    description: 'Perform operations immediately after the stripe subscription has completed',
    arguments: [
      { subscription: 'The subscription' },
      { collection: 'Associated collection of the subscription' },
      { document: 'Associated document in collection to the charge' },
      { args: 'Original mutation arguments' },
      { user: 'The user' },
    ],
    runs: 'async',
    newSyntax: true,
  });

  registerCallback({
    name: 'stripe.process.sync',
    description: 'Modify any metadata before sending the charge to stripe',
    arguments: [
      {
        modifier: 'The modifier object used to update the associated collection',
      },
      { collection: 'Collection associated to the product' },
      { document: 'Associated document' },
      { chargeDoc: "Charge document returned by Stripe's API" },
      { user: 'The user' },
    ],
    runs: 'sync',
    returns: 'The modified arguments to be sent to stripe',
  });

  registerCallback({
    name: 'stripe.process.async',
    description: 'Modify any metadata before sending the charge to stripe',
    arguments: [
      { collection: 'Collection associated to the product' },
      { document: 'Associated document' },
      { chargeDoc: "Charge document returned by Stripe's API" },
      { user: 'The user' },
    ],
    runs: 'async',
    returns: 'The modified arguments to be sent to stripe',
  });

  // Create plans if they don't exist
  if (stripeSettings && stripeSettings.createPlans) {
    // eslint-disable-next-line no-console
    console.log('Creating stripe plans...');
    Promise.awaitAll(
      Object.keys(Products)
        // Filter out function type products and those without a plan defined (non-subscription)
        .filter(productKey => typeof Products[productKey] === 'object' && Products[productKey].plan)
        .map(productKey => createOrRetrievePlan(Products[productKey]))
    );
    // eslint-disable-next-line no-console
    console.log('Finished creating stripe plans.');
  }
});
