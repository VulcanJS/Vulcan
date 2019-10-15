import { registerComponent } from 'meteor/vulcan:lib';
import React from 'react';

const SortNone = () => (
  <svg width="16" height="16" viewBox="0 0 438 438" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M25.7368 247.243H280.263C303.149 247.243 314.592 274.958 298.444 291.116L171.18 418.456C161.128 428.515 144.872 428.515 134.926 418.456L7.55631 291.116C-8.59221 274.958 2.85078 247.243 25.7368 247.243ZM298.444 134.884L171.18 7.54408C161.128 -2.51469 144.872 -2.51469 134.926 7.54408L7.55631 134.884C-8.59221 151.042 2.85078 178.757 25.7368 178.757H280.263C303.149 178.757 314.592 151.042 298.444 134.884Z"
      transform="translate(66 6)"
      fill="#000"
      fillOpacity="0.2"
    />
  </svg>
);

const SortDesc = () => (
  <svg width="16" height="16" viewBox="0 0 438 438" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M25.7368 0H280.263C303.149 0 314.592 27.7151 298.444 43.8734L171.18 171.213C161.128 181.272 144.872 181.272 134.926 171.213L7.55631 43.8734C-8.59221 27.7151 2.85078 0 25.7368 0Z"
      transform="translate(66 253.243)"
      fill="black"
      fillOpacity="0.7"
    />
    <path
      d="M171.18 7.54408L298.444 134.884C314.592 151.042 303.149 178.757 280.263 178.757H25.7368C2.85078 178.757 -8.59221 151.042 7.55631 134.884L134.926 7.54408C144.872 -2.51469 161.128 -2.51469 171.18 7.54408Z"
      transform="translate(66 6)"
      fill="black"
      fillOpacity="0.2"
    />
  </svg>
);

const SortAsc = () => (
  <svg width="16" height="16" viewBox="0 0 438 438" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M298.444 134.884L171.18 7.54408C161.128 -2.51469 144.872 -2.51469 134.926 7.54408L7.55631 134.884C-8.59221 151.042 2.85078 178.757 25.7368 178.757H280.263C303.149 178.757 314.592 151.042 298.444 134.884Z"
      transform="translate(66 6)"
      fill="black"
      fillOpacity="0.7"
    />
    <path
      d="M280.263 0H25.7368C2.85078 0 -8.59221 27.7151 7.55631 43.8734L134.926 171.213C144.872 181.272 161.128 181.272 171.18 171.213L298.444 43.8734C314.592 27.7151 303.149 0 280.263 0Z"
      transform="translate(66 253.243)"
      fill="black"
      fillOpacity="0.2"
    />
  </svg>
);

const DatatableSorter = ({ name, label, toggleSort, currentSort }) => (
  <span
    className="datatable-sorter"
    onClick={() => {
      toggleSort(name);
    }}>
    {!currentSort[name] ? <SortNone /> : currentSort[name] === 'asc' ? <SortAsc /> : <SortDesc />}
  </span>
);

registerComponent('DatatableSorter', DatatableSorter);
