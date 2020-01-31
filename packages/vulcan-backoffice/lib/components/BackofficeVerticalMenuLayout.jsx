import React from 'react';
import { registerComponent } from 'meteor/vulcan:lib';
import styled from 'styled-components';

const StyledWrapper = styled.div`
	display: flex;
	overflow: auto;
	height: 100%;
`

const StyledSide = styled.div`
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

const BackofficeVerticalMenuLayout = ({side, main, open}) => {
  return (
		<StyledWrapper>

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
