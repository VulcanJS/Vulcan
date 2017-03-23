// The main Movies collection
import MoviesImport from './collection.js';

// Text strings used in the UI
import './i18n.js';

// Groups & user permissions
import './permissions.js';

// GraphQL fragments used to query for data
import './fragments.js';

// React components
import './components.js';

// Routes
import './routes.js';

// Sorting & filtering parameters
import './parameters.js';

// Add Movies collection to global Meteor namespace (optional)
Movies = MoviesImport;