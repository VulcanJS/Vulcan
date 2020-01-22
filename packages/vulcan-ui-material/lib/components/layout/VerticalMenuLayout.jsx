import React from 'react';
import Grid from '@material-ui/core/Grid';
import { registerComponent } from 'meteor/vulcan:lib';

const styleSide = {
  zIndex: 1,
  top: 0,
  left: 0,
  paddingTop: '60px',
  height: '100vh',
  overflowX: 'hidden'
}

const styleSideClose = {
  width : 0,
  display: 'none',
  position: 'fixed'
}

const styleSideOpen = {
  width : 'auto',
  display: 'block',
  position: 'relative'
}

const VerticalMenuLayout = ({side, main, open}) => {
  const style = open ? { ...styleSide, ...styleSideOpen } : { ...styleSide, ...styleSideClose }

  return (
    <Grid container spacing={2}>
      <Grid item xs style={style}>
        {side}
      </Grid>
      <Grid item xs={11} style={{whiteSpace: 'nowrap', overflow: 'auto', height: '100vh'}}>
        {main}
      </Grid>
    </Grid>
  )
}

registerComponent('VerticalMenuLayout', VerticalMenuLayout);
