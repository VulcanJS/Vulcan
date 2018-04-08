import * as modules from './index'
import _ from 'underscore'

it('should import all files correctly', () => {
  _.mapObject(modules, (value, key) => {
    expect(typeof value).toBe('function')
  })
})
