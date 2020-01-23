import React from 'react';
import { registerComponent } from 'meteor/vulcan:lib';
import Grid from '@material-ui/core/Grid';
import styled from 'styled-components';

const StyledGridContainer = styled(({topPadding, ...rest}) => <Grid {...rest} />)`
	height: ${props => `calc(100vh - ${props.topPadding}px);`}
`

const StyledSideGrid = styled(props => <Grid {...props} />)`
	z-index: 1000;
	height: 100%;
	overflow-x: hidden;
	background-color: #f7f7f7;
	border-right: 1px solid #ececec;
	transition: all 0.5s ease-out;

	${props => props.open ? `
		width: 200px;
		visibility: visible;
	` : `
		width: 0;
		visibility: hidden;
	`}
`

const StyledMainGrid = styled(props => <Grid {...props} />)`
	display: flex;
	flex-grow: 1;
`

const VerticalMenuLayout = ({side, main, open, topPadding = 0}) => {
  return (
		<StyledGridContainer container topPadding={topPadding}>
			<StyledSideGrid item open={open}>
				{side}
			</StyledSideGrid>

			<StyledMainGrid item>
				{main}
			</StyledMainGrid>
		</StyledGridContainer>
	)
}

registerComponent('VerticalMenuLayout', VerticalMenuLayout);
