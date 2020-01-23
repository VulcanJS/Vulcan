import React from 'react';
import { registerComponent } from 'meteor/vulcan:lib';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import styled from 'styled-components';

const StyledContainer = styled(({topPadding, ...rest}) => <Container {...rest} />)`
	height: ${props => `calc(100vh - ${props.topPadding}px);`}
`

const StyledSideCol = styled(props => <Col {...props} />)`
	z-index: 1000;
	top: 0;
	left: 0;
	height: 100%;
	overflow-x: hidden;
	background-color: #f7f7f7;
	border-right: 1px solid #ececec;
	padding: 0;
	transition: all 0.5s ease-out;

	${props => props.open ? `
		width: 200px;
		visibility: visible;
	` : `
		width: 0;
		visibility: hidden;
	`}
`

const StyledRow = styled(props => <Row {...props} />)`
	height: 100%;
`

const StyledMainCol = styled(props => <Col {...props} />)`
	height: 100%;
	white-space: nowrap;
	overflow: auto;
	padding: 0;
`

const VerticalMenuLayout = ({side, main, open, topPadding = 0}) => {
  return (
		<StyledContainer fluid topPadding={topPadding}>
			<StyledRow>
        <StyledSideCol open={open} sm="auto" xs="auto">
					{side}
				</StyledSideCol>
        <StyledMainCol>
					{main}
				</StyledMainCol>
      </StyledRow>
    </StyledContainer>
  )
}

registerComponent('VerticalMenuLayout', VerticalMenuLayout);
