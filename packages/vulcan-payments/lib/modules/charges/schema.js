import moment from 'moment';

const schema = {

  // default properties

  _id: {
    type: String,
    optional: true,
    viewableBy: ['guests'],
  },
  createdAt: {
    type: Date,
    optional: true,
    viewableBy: ['guests'],
    onInsert: (document, currentUser) => {
      return new Date();
    }
  },
  userId: {
    type: String,
    optional: true,
    viewableBy: ['guests'],
  },
  
  // custom properties

  associatedCollection: {
    type: String,
    optional: true,
  },

  associatedId: {
    type: String,
    optional: true,
  },

  tokenId: {
    type: String,
    optional: false,
  },

  productKey: {
    type: String,
    optional: true,
  },

  type: {
    type: String,
    optional: false,
  },

  test: {
    type: Boolean,
    optional: true,
  },

  data: {
    type: Object,
    blackbox: true,
  },

  properties: {
    type: Object,
    blackbox: true,
  },

  ip: {
    type: String,
    optional: true,
  },

  // GraphQL only

  createdAtFormatted: {
    type: String,
    optional: true,
    resolveAs: {
      type: 'String',
      resolver: (charge, args, context) => {
        return moment(charge.createdAt).format('dddd, MMMM Do YYYY');
      }
    }  
  },

  stripeChargeUrl: {
    type: String,
    optional: true,
    resolveAs: {
      type: 'String',
      resolver: (charge, args, context) => {
        return `https://dashboard.stripe.com/payments/${charge.data.id}`;
      }
    } 
  },

};

export default schema;
