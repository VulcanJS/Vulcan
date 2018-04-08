import {Random} from 'meteor/random'

export default function () {
  return {
    id: Random.id(),
    close () {
      // nothing to close here
    }
  }
}
