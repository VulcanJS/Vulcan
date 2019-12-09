import { peopleSchema } from './schema';
import { createDummyCollection } from 'meteor/vulcan:test';

export const dataSampleCollection = createDummyCollection({ schema: peopleSchema });
