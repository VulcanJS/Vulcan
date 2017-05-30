// @flow
import React from 'react'
import Button from 'react-bootstrap'

import { connect } from 'react-redux'

import { editMode } from 'ory-editor-core/lib/actions/display'
import { isEditMode } from 'ory-editor-core/lib/selector/display'
import { createStructuredSelector } from 'reselect'

const Inner = ({ isEditMode, editMode }: { isEditMode: bool, editMode: Function }) => (
  <Button
    label="Edit things"
    active={isEditMode}
    onClick={editMode}
  />
)

const mapStateToProps = createStructuredSelector({ isEditMode })
const mapDispatchToProps = { editMode }

export default connect(mapStateToProps, mapDispatchToProps)(Inner)
