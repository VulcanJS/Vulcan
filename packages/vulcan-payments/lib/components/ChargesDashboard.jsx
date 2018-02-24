import React from 'react';
import { registerComponent, Components } from 'meteor/vulcan:lib';

// import { Link } from 'react-router';
// const AssociatedDocument = ({ document }) => {
//   <Link to={document.pageUrl}>{document._id}</Link>
// }

const ChargesDashboard = props => 
  <div className="charges">
    <Components.Datatable
      showSearch={false}
      showEdit={false}
      collectionName="Charges"
      options={{
        fragmentName: 'ChargeFragment'
      }}
      columns={[
        'createdAtFormatted', 
        'user', 
        'type', 
        'source',
        'productKey',
        'test',
        'properties',
        'stripeChargeUrl',
      ]}
    />
  </div>

registerComponent('ChargesDashboard', ChargesDashboard);