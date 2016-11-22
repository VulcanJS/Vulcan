import gql from 'graphql-tag';

const fragments = {
  
  list: {
    name: 'categoriesListFragment',
    fragment: gql`
      fragment categoriesListFragment on Category {
        _id
        name
        description
        order
        slug
        image
        parent { 
          # feels weird to repeat the same fields... but we cannot call the fragment on itself?!
          _id
          name
          description
          order
          slug
          image
        }
      }
    `,
  },

  single: {
    name: 'categoriesSingleFragment',
    fragment: gql`
      fragment categoriesSingleFragment on Category {
        _id
        name
        description
        order
        slug
        image
        parent { 
          # feels weird to repeat the same fields... but we cannot call the fragment on itself?!
          _id
          name
          description
          order
          slug
          image
        }
      }
    `,
  },
};

export default fragments;