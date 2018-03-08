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
    viewableBy: ['admins'],
    onInsert: (document, currentUser) => {
      return new Date();
    },
  },
  userId: {
    type: String,
    optional: true,
    viewableBy: ['admins'],
    resolveAs: {
      fieldName: 'user',
      type: 'User',
      resolver: async (post, args, { currentUser, Users }) => {
        const user = await Users.loader.load(post.userId);
        return Users.restrictViewableFields(currentUser, Users, user);
      },
      addOriginalField: true
    },
  },
  type: {
    type: String,
    optional: true,
    viewableBy: ['admins'],
  },
  
  // custom properties

  associatedCollection: {
    type: String,
    viewableBy: ['admins'],
    optional: true,
  },

  associatedId: {
    type: String,
    viewableBy: ['admins'],
    optional: true,
  },

  tokenId: {
    type: String,
    optional: false,
  },

  productKey: {
    type: String,
    viewableBy: ['admins'],
    optional: true,
  },

  source: {
    type: String,
    viewableBy: ['admins'],
    optional: false,
  },

  test: {
    type: Boolean,
    viewableBy: ['admins'],
    optional: true,
  },

  data: {
    type: Object,
    viewableBy: ['admins'],
    blackbox: true,
  },

  properties: {
    type: Object,
    viewableBy: ['admins'],
    blackbox: true,
  },

  ip: {
    type: String,
    viewableBy: ['admins'],
    optional: true,
  },

  // GraphQL only

  amount: {
    type: Number,
    optional: true,
    viewableBy: ['admins'],
    resolveAs: {
      type: 'Int',
      resolver: charge => charge.data.amount,
    }  
  },

  createdAtFormatted: {
    type: String,
    optional: true,
    viewableBy: ['admins'],
    resolveAs: {
      type: 'String',
      resolver: (charge, args, context) => {
        return moment(charge.createdAt).format('dddd, MMMM Do YYYY');
      }
    }  
  },

  createdAtFormattedShort: {
    type: String,
    optional: true,
    viewableBy: ['admins'],
    resolveAs: {
      type: 'String',
      resolver: (charge, args, context) => {
        return moment(charge.createdAt).format('YYYY/MM/DD, hh:mm');
      }
    }  
  },

  stripeId: {
    type: String,
    optional: true,
    viewableBy: ['admins'],
    resolveAs: {
      type: 'String',
      resolver: (charge, args, context) => {
        return charge.data && charge.data.id;
      }
    } 
  },

  stripeChargeUrl: {
    type: String,
    optional: true,
    viewableBy: ['admins'],
    resolveAs: {
      type: 'String',
      resolver: (charge, args, context) => {
        return `https://dashboard.stripe.com/payments/${charge.data.id}`;
      }
    } 
  },

  // doesn't work yet

  // associatedDocument: {
  //   type: Object,
  //   viewableBy: ['admins'],
  //   optional: true,
  //   resolveAs: {
  //     type: 'Chargeable',
  //     resolver: (charge, args, context) => {
  //       const collection = getCollection(charge.associatedCollection);
  //       return collection.loader.load(charge.associatedId);
  //     }
  //   } 
  // },

};

export default schema;
