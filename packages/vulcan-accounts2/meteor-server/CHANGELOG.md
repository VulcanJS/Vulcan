# Changelog

### v3.1.0

- Use http instead of meteor to make Facebook login.

### v3.0.1

- Fix bug with ```tmeasday:check-npm-versions```.

### v3.0.0

- Use [orionsoft:graphql-loader](https://github.com/orionsoft/graphql-loader) to initialize package.
- Add user field to LoginMethodResponse [#23](https://github.com/nicolaslopezj/meteor-apollo-accounts/issues/23).

### v2.2.0

- Use async in all mutations.

### v2.1.0

- Add plainPassword option to createUser.

### v2.0.0

- Make ```SchemaMutations```, ```SchemaTypes``` and ```Resolvers``` functions that receive options.

To migrate change:

- ```SchemaMutations``` to ```SchemaMutations()```
- ```SchemaTypes``` to ```SchemaTypes()```
- ```Resolvers``` to ```Resolvers()```

### v1.4.0

- Login with linkedin.

### v1.3.7

- Fix destroyToken in logout.

### v1.3.6

- Fix error throwing on ```loginWithPassword```.

### v1.3.5

- Fix production ```standard-minifier-js``` error.

### v1.3.4

- Add some oauth dependencies to only require installation of accounts-xx.
- Fix oauth login not throwing errors.

### v1.3.3

- Add ```accounts-password``` to weak dependencies.

### v1.3.2

- Fix ```Mutation.createUser defined in resolvers, but not in schema```

### v1.3.1

- Don't use graphql-compiler
- Add conditional to password service mutations.

### v1.3.0

- Pass login method in error message when user tries to log in with the incorrect service.

### v1.2.0

- Conditional mutation if service is installed
- Accounts facebook
- Accounts google
