import React from 'react';
import { registerComponent, Components } from 'meteor/vulcan:lib';

// import { Link } from 'react-router';
// const AssociatedDocument = ({ document }) => {
//   <Link to={document.pageUrl}>{document._id}</Link>
// }

const StripeId = ({ document }) => 
  <a href={document.stripeChargeUrl} target="_blank">{document.stripeId}</a>;

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
        {
          name: 'createdAtFormattedShort', 
          label: 'Created At',
        },
        'user',
        'amount',
        'type', 
        'source',
        'productKey',
        'test',
        'properties',
        {
          name: 'stripeId',
          component: StripeId
        },
      ]}
    />
  </div>;

registerComponent('ChargesDashboard', ChargesDashboard);