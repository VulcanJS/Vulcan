import moment from 'moment';

const schema = {

  // default properties

  _id: {
    type: String,
    optional: true,
    canRead: ['guests'],
  },
  createdAt: {
    type: Date,
    optional: true,
    canRead: ['admins'],
    onCreate: () => {
      return new Date();
    },
  },
  userId: {
    type: String,
    optional: true,
    canRead: ['admins'],
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
  
  // custom properties

  type: {
    type: String,
    optional: true,
    canRead: ['admins'],
  },

  associatedCollection: {
    type: String,
    canRead: ['admins'],
    optional: true,
  },

  associatedId: {
    type: String,
    canRead: ['admins'],
    optional: true,
  },

  tokenId: {
    type: String,
    optional: false,
  },

  productKey: {
    type: String,
    canRead: ['admins'],
    optional: true,
  },

  source: {
    type: String,
    canRead: ['admins'],
    optional: false,
  },

  test: {
    type: Boolean,
    canRead: ['admins'],
    optional: true,
  },

  data: {
    type: Object,
    // canRead: ['admins'], // for security's sake don't expose this through GraphQL API
    blackbox: true,
  },

  properties: {
    type: Object,
    canRead: ['admins'],
    blackbox: true,
  },

  ip: {
    type: String,
    canRead: ['admins'],
    optional: true,
  },

  amount: {
    type: Number,
    optional: true,
    canRead: ['admins'],
    onCreate: ({ data: charge }) => charge.data && charge.data.amount,
    // resolveAs: {
    //   type: 'Int',
    //   resolver: charge => {console.log(charge); return charge.data && charge.data.amount},
    // }  
  },

  stripeId: {
    type: String,
    optional: true,
    canRead: ['admins'],
    onCreate: ({ data: charge }) => charge.data && charge.data.id,
    // resolveAs: {
    //   type: 'String',
    //   resolver: (charge, args, context) => {
    //     return charge.data && charge.data.id;
    //   }
    // } 
  },

  stripeChargeUrl: {
    type: String,
    optional: true,
    canRead: ['admins'],
    resolveAs: {
      type: 'String',
      resolver: (charge, args, context) => {
        return `https://dashboard.stripe.com/payments/${charge.stripeId}`;
      }
    } 
  },

  // doesn't work yet

  // associatedDocument: {
  //   type: Object,
  //   canRead: ['admins'],
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
