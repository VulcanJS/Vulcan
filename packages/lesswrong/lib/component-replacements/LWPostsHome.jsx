import { Components, getRawComponent, replaceComponent, withCurrentUser } from 'meteor/vulcan:core';
import React from 'react';
import { Col, Row } from 'react-bootstrap';

const LWPostsHome = (props, context) => {
  const terms = _.isEmpty(props.location && props.location.query) ? {view: 'top'}: props.location.query;

  return (
    <div className="posts-home">
      <Row>
        {this.currentUser ? null : <Components.WelcomeBox />}

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

replaceComponent('PostsHome', LWPostsHome, withCurrentUser);
