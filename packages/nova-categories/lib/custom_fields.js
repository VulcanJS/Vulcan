import Posts from "meteor/nova:posts";

Posts.addField(
  {
    fieldName: 'categories',
    fieldSchema: {
      type: [String],
      control: "checkboxgroup",
      optional: true,
      insertableBy: ['members'],
      editableBy: ['members'],
      viewableBy: ['guests'],
      form: {
        noselect: true,
        type: "bootstrap-category",
        order: 50,
        options: function (formProps) {

          // catch the ApolloClient from the form props
          const {client} = formProps;

          // get the current data of the store
          const apolloData = client.store.getState().apollo.data;
          
          // filter these data based on their typename: we are interested in the categories data
          const categories = _.filter(apolloData, (object, key) => {
            return object.__typename === 'Category'
          });

          // give the form component (here: checkboxgroup) exploitable data
          const categoriesOptions = categories.map(function (category) {
            return {
              value: category._id,
              label: category.name,
              slug: category.slug, // note: it may be used to look up from prefilled props
            };
          });

          return categoriesOptions;
        }
      },
      // publish: true,
      // join: {
      //   joinAs: "categoriesArray",
      //   collection: () => Categories
      // },
      resolveAs: 'categories: [Category]'
    }
  }
);
