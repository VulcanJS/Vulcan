import React from 'react';
import { registerComponent } from 'meteor/vulcan:lib';
import styled from 'styled-components';

const StyleWrapper = styled(({topPadding, ...rest}) => <div {...rest} />)`
	display: flex;
	height: ${props => `calc(100vh - ${props.topPadding}px);`}
`

const StyleSide = styled(props => <div {...props} />)`
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

const StyleMain = styled(props => <div {...props} />)`
	flex-grow: 1;
`

const VerticalMenuLayout = ({side, main, open, topPadding = 0}) => {
  return (
		<StyleWrapper topPadding={topPadding}>
			<StyleSide open={open}>
				{side}
			</StyleSide>

			<StyleMain>
				{main}
			</StyleMain>
		</StyleWrapper>
	)
}

registerComponent('VerticalMenuLayout', VerticalMenuLayout);
