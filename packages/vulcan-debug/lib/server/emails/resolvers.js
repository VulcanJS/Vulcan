import VulcanEmail from 'meteor/vulcan:email';

const resolvers = {
  multi: {
    resolver() {
      const results = Object.keys(VulcanEmail.emails).map(name => {
        const email = VulcanEmail.emails[name];
        const subject = typeof email.subject === 'function' ? email.subject({}) : email.subject;
        return { ...email, subject, name };
      });
      return { results, totalCount: results.length };
    },
  },
};

export default resolvers;
