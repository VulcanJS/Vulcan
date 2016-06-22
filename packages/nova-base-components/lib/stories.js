import React from 'react'
import { storiesOf } from './helpers.js'

import Loading from './common/Loading.jsx'
storiesOf('Loading', module)
  .add('default', () => <Loading />)
