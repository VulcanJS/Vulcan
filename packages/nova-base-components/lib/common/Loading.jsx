import Telescope from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';

const Loading = ({color}) => {
  return (
    <div className={color === "white" ? "spinner white" : "spinner"}>
      <div className="bounce1"></div>
      <div className="bounce2"></div>
      <div className="bounce3"></div>
    </div>
  )
}

Loading.propTypes = {
  color: React.PropTypes.string
}

Loading.defaultProps = {
  color: "black"
}

Loading.displayName = "Loading";

Telescope.registerComponent('Loading', Loading);