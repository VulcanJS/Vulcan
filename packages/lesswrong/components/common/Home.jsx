import { Components, getRawComponent, registerComponent} from 'meteor/vulcan:core';
import React from 'react';
import { Col, Row } from 'react-bootstrap';

const Home = (props, context) => {
  const terms = _.isEmpty(props.location && props.location.query) ? {view: 'top'}: props.location.query;

  return (
    <div className="posts-home">
      <Row>
        <Components.Section title="Test Title">
          <p>
            This is some text, let's see how it looks
          </p>
        </Components.Section>

        {/* Sidebar Layout */}
        <Col xs={12} md={8}>
          <Components.PostsList terms={terms}/>
        </Col>
        <Col xs={12} md={4}>
          <Components.Sidebar />
        </Col>
      </Row>
    </div>
  )
};

registerComponent('Home', Home);
