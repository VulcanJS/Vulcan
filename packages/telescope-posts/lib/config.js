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
    label: function(){return i18n.t('pending');}
  },
  {
    value: 2,
    label: function(){return i18n.t('approved');}
  },
  {
    value: 3,
    label: function(){return i18n.t('rejected');}
  }
];

Posts.config.STATUS_PENDING = 1;
Posts.config.STATUS_APPROVED = 2;
Posts.config.STATUS_REJECTED = 3;