const schema = {
  _id: {
    type: String,
  },
  createdAt: {
    type: Date,
    optional: true,
  },
  userId: {
    type: String,
    optional: true,
  },
  scheduledAt: {
    type: Date,
    optional: true,
  },
  subject: {
    type: String,
    optional: true,
  },
  data: {
    type: String,
    optional: true,
  },
  html: {
    type: String,
    optional: true,
  },
  provider: {
    type: String,
    optional: true,
  },
};

export default schema;