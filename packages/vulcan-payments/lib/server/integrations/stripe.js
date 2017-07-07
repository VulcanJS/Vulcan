import { getSetting, newMutation, editMutation, Collections, runCallbacks, runCallbacksAsync } from 'meteor/vulcan:core';
// import express from 'express';
import Stripe from 'stripe';
// import { Picker } from 'meteor/meteorhacks:picker';
// import bodyParser from 'body-parser';
import Charges from '../../modules/charges/collection.js';
import Users from 'meteor/vulcan:users';
import { Products } from '../../modules/products.js';

const stripeSettings = getSetting('stripe');

const sampleProduct = {
  amount: 10000,
  name: 'My Cool Product',
  description: 'This product is awesome.',
  currency: 'USD',
}

// returns a promise:
export const createCharge = async (args) => {
  
  let collection, document, returnDocument = {};

  const {token, userId, productKey, associatedCollection, associatedId, properties } = args;

  if (!stripeSettings) {
    throw new Error('Please fill in your Stripe settings');
  }
  
  // initialize Stripe
  const keySecret = Meteor.isDevelopment ? stripeSettings.secretKeyTest : stripeSettings.secretKey;
  const stripe = new Stripe(keySecret);

  // if an associated collection name and document id have been provided, 
  // get the associated collection and document
  if (associatedCollection && associatedId) {
    collection = _.findWhere(Collections, {_name: associatedCollection});
    document = collection.findOne(associatedId);
  }

  // get the product from Products (either object or function applied to doc)
  // or default to sample product
  const definedProduct = Products[productKey];
  const product = typeof definedProduct === 'function' ? definedProduct(document) : definedProduct || sampleProduct;

  // get the user performing the transaction
  const user = Users.findOne(userId);

  // create Stripe customer
  const customer = await stripe.customers.create({
    email: token.email,
    source: token.id
  });

  // create Stripe charge
  const charge = await stripe.charges.create({
    amount: product.amount,
    description: product.description,
    currency: product.currency,
    customer: customer.id,
    metadata: {
      userId: userId,
      userName: Users.getDisplayName(user),
      userProfile: Users.getProfileUrl(user, true),
      ...properties
    }
  });

  // create charge document for storing in our own Charges collection
  const chargeDoc = {
    createdAt: new Date(),
    userId,
    tokenId: token.id, 
    type: 'stripe',
    test: !token.livemode,
    data: charge,
    ip: token.client_ip,
    properties,
    productKey,
  }

  // insert
  const chargeSaved = newMutation({
    collection: Charges,
    document: chargeDoc, 
    validate: false,
  });

  // if an associated collection and id have been provided, 
  // update the associated document
  if (collection && document) {
    
    const chargeIds = document.chargeIds ? [...document.chargeIds, chargeSaved._id] : [chargeSaved._id];

    let modifier = {
      $set: {chargeIds},
      $unset: {}
    }
    // run collection.charge.sync callbacks
    modifier = runCallbacks(`${collection._name}.charge.sync`, modifier, document, chargeDoc);

    returnDocument = editMutation({
      collection,
      documentId: associatedId,
      set: modifier.$set,
      unset: modifier.$unset,
      validate: false
    });

    returnDocument.__typename = collection.typeName;

  }

  runCallbacksAsync(`${collection._name}.charge.async`, returnDocument, chargeDoc);

  return returnDocument;
}

/*

POST route with Picker

*/

// Picker.middleware(bodyParser.text());

// Picker.route('/charge', function(params, req, res, next) {

//   const body = JSON.parse(req.body);

//   // console.log(body)

//   const { token, userId, productKey, associatedCollection, associatedId } = body;

//   createCharge({
//     token,
//     userId,
//     productKey,
//     associatedCollection,
//     associatedId,
//     callback: (charge) => {
//       // return Stripe charge
//       res.end(JSON.stringify(charge));
//     }
//   });

// });
