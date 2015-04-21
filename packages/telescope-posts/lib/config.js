/**
 * Posts config namespace
 * @type {Object}
 */
Posts.config = {};


/**
 * Post Statuses
 */
Posts.config.postStatuses = [
  {
    value: 1,
    label: 'Pending'
  },
  {
    value: 2,
    label: 'Approved'
  },
  {
    value: 3,
    label: 'Rejected'
  }
];

Posts.config.STATUS_PENDING = 1;
Posts.config.STATUS_APPROVED = 2;
Posts.config.STATUS_REJECTED = 3;
