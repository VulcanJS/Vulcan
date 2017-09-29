import { addCustomFields } from '../modules/index.js';

export const makeCloudinary = ({collection, fieldName}) => {
  addCustomFields(collection);
}