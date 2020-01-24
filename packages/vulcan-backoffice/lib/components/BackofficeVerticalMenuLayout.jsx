import React from 'react';
import { registerComponent } from 'meteor/vulcan:lib';
import styled from 'styled-components';

const StyledWrapper = styled(({topPadding, ...rest}) => <div {...rest} />)`
	display: flex;
	height: ${props => `calc(100vh - ${props.topPadding}px);`}
`

const StyledSide = styled(props => <div {...props} />)`
	top: 0;
	left: 0;
	height: 100%;
	overflow-x: hidden;
	background-color: #f7f7f7;
	border-right: 1px solid #ececec;
	padding: 0;
	transition: all 0.5s ease-out;

	${props => props.open ? `
		min-width: 200px;
		width: 200px;
		visibility: visible;
	` : `
		min-width: 0;
		width: 0;
		visibility: hidden;
	`}
`

const StyledMain = styled.div`
	flex-grow: 1;
	overflow: auto;
`

const BackofficeVerticalMenuLayout = ({side, main, open, topPadding = 0}) => {
  return (
		<StyledWrapper fluid topPadding={topPadding}>

			<StyledSide open={open}>
				{side}
			</StyledSide>

			<StyledMain>
				{main}
			</StyledMain>

    </StyledWrapper>
  )
}

registerComponent('BackofficeVerticalMenuLayout', BackofficeVerticalMenuLayout);
