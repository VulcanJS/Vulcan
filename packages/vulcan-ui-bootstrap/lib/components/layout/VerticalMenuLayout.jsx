import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { registerComponent } from 'meteor/vulcan:lib';

const styleSide = {
	zIndex: 1,
	top: 0,
	left: 0,
	height: '100%',
	overflowX: 'hidden',
	backgroundColor: '#f7f7f7',
	borderRight: '1px solid #ececec'
}

const styleSideClose = {
  width : 0,
  display: 'none',
  position: 'sticky'
}

const styleSideOpen = {
  width : '200px',
  display: 'block',
  position: 'relative'
}

const styleMain = {
	whiteSpace: 'nowrap',
	overflow: 'auto',
	marginTop: '10px'
}

const VerticalMenuLayout = ({side, main, open, topPadding = 0}) => {
  const style = open ? { ...styleSide, ...styleSideOpen } : { ...styleSide, ...styleSideClose }

  return (
		<Container fluid style={{ height: `calc(100vh - ${topPadding}px)` }}>
			<Row style={{ height: '100%' }}>
        <Col sm="auto" xs="auto" style={style}>{side}</Col>
        <Col style={styleMain}>{main}</Col>
      </Row>
    </Container>
  )
}

registerComponent('VerticalMenuLayout', VerticalMenuLayout);
