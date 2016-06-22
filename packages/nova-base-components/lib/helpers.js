import React from 'react'
import { storiesOf } from '@kadira/storybook'
import WithContext from 'react-with-context'

export const storiesWithContext = (kind, m, context) => (
  storiesOf(kind, m).addDecorator((story) => (
    <WithContext context={context}>{story()}</WithContext>
  ))
)

export * from '@kadira/storybook'
