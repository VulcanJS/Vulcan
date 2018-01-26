/* 

components/MoviesList.jsx #tutorial-step-7 - 
The component for our list of movies, which we called in to modules/routes.js.

Wrapped with the "withList" and "withCurrentUser" containers.

#tutorial-step-11 -
Now, we are going to look at this in a bit more detail.
This component is a React component. We only have one but it does a bunch of things... 
*/

import React from 'react';
import Helmet from 'react-helmet';
import { Components, withList, withCurrentUser, registerComponent } from 'meteor/vulcan:core';

import Movies from '../../modules/movies/collection.js';

{
  /* These are "props". They are variables for the component that are passed by the components parent. 
  In this case, to create the parent we wrapped the component in "Higer Order Compoents" (See the Higer Order Compoents section below.) 
    By doing this, we can pass on those props to the children of he HOCs and give them access to the props... */
}
const MoviesList = ({
  results = [],
  currentUser,
  loading,
  loadMore,
  count,
  totalCount
}) => (
  <div style={{ maxWidth: "500px", margin: "20px auto" }}>
    {/* First, this is a Helment tag. It's a React package that loads head tags. We're using it to load the Bootstrap stylesheet. 
      This is not Vulcan specific but it is an easy way to add tags to the head... */}
    <Helmet>
      <link
        name="bootstrap"
        rel="stylesheet"
        type="text/css"
        href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.5/css/bootstrap.min.css"
      />
    </Helmet>

    {/* user accounts */}

    <div
      style={{
        padding: "20px 0",
        marginBottom: "20px",
        borderBottom: "1px solid #ccc"
      }}
    >
      {/* ...This is the log in form component. It allowed you to create an account in our web app.
        It takes care of all accounts stuff like changing passwords, signing in and out, and so on
        Just pop this in anywhere you want to use it. It's in the Vulcan accounts package...  */}
      <Components.AccountsLoginForm />
    </div>

    {/* ... We have a test for the loding variable (See the "Higher Order Components" section at the bottom and then the "props" section at the top.)... */}
    {loading ? (
      <Components.Loading />
    ) : (
      <div className="movies">
        {/* new document form - this if for inserting new documents. Because the collection has the schema, when we generate the form, it know what the colleciton should look like
          You only need to specify the colleciton. You don't need to code any of the form. Validation will work and it will show you fields based on your user permission...*/}

        {Movies.options.mutations.new.check(currentUser) ? (
          <div
            style={{
              marginBottom: "20px",
              paddingBottom: "20px",
              borderBottom: "1px solid #ccc"
            }}
          >
            <h4>Insert New Document</h4>
            <Components.SmartForm collection={Movies} />
          </div>
        ) : null}

        {/* documents list - this is another small utility in Vulcan and it will display it as a card... */}

        {results.map(movie => (
          <Components.Card
            fields={["name", "year", "review"]}
            key={movie._id}
            collection={Movies}
            document={movie}
            currentUser={currentUser}
          />
        ))}

        {/* load more - this is the load more button. On click we trigger the loadMore function which is passed as a prop by withList... */}

        {totalCount > results.length ? (
          <a
            href="#"
            onClick={e => {
              e.preventDefault();
              loadMore();
            }}
          >
            Load More ({count}/{totalCount})
          </a>
        ) : (
          <p>No more items.</p>
        )}
      </div>
    )}
  </div>
);

// ...this is where we specify how to load the data in the options object that we pass to withList
// if you want, you can specify many more options here, like how often to look for data or what fields to query from, filtering and sorting options. ...
const options = {
  collection: Movies,
  limit: 5,
};

// These two functions (withList & withCurrentUser) are Higher Order Components (HOC) and by wrapping our component with this we can give it "props". (See the "props" section at the top.)
registerComponent('MoviesList', MoviesList, withCurrentUser, [withList, options]);


// #tutorial-step-12 - Well. that's it! If you like this, go on to the movies-example, where we get more granular when it comes to data loading.
// Well thanks for tuning in! Come visit us at our chat room at slack.vulcanjs.org. See you soon!
