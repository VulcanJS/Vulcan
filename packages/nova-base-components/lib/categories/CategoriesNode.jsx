import { Components, registerComponent } from 'meteor/vulcan:core';
import React, { PropTypes, Component } from 'react';

class CategoriesNode extends Component {

  renderCategory(category) {
    return (
      <Components.Category category={category} key={category._id} openModal={this.props.openModal} />
    )
  }

  renderChildren(children) {
    return (
      <div className="categories-children">
        {children.map(category => <CategoriesNode category={category} key={category._id} />)}
      </div>
    )
  }

  render() {

    const category = this.props.category;
    const children = this.props.category.childrenResults;

    return (
      <div className="categories-node">
        {this.renderCategory(category)}
        {children ? this.renderChildren(children) : null}
      </div>
    )
  }

}

CategoriesNode.propTypes = {
  category: React.PropTypes.object.isRequired, // the current category
};

registerComponent('CategoriesNode', CategoriesNode);
