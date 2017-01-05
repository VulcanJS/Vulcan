import { Components, registerComponent } from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, DropdownButton, MenuItem, Modal } from 'react-bootstrap';
import { ShowIf, withList } from "meteor/nova:core";
import { withRouter } from 'react-router'
import { LinkContainer } from 'react-router-bootstrap';
import Categories from 'meteor/nova:categories';
import gql from 'graphql-tag';

// note: cannot use ModalTrigger component because of https://github.com/react-bootstrap/react-bootstrap/issues/1808

class CategoriesList extends Component {

  constructor() {
    super();
    this.openCategoryEditModal = this.openCategoryEditModal.bind(this);
    this.openCategoryNewModal = this.openCategoryNewModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.state = {
      openModal: false
    }
  }

  openCategoryNewModal() {
    // new category modal has number 0
    this.setState({openModal: 0});
  }

  openCategoryEditModal(index) {
    // edit category modals are numbered from 1 to n
    this.setState({openModal: index+1});
  }

  closeModal() {
    this.setState({openModal: false});
  }

  renderCategoryEditModal(category, index) {

    return (
      <Modal key={index} show={this.state.openModal === index+1} onHide={this.closeModal}>
        <Modal.Header closeButton>
          <Modal.Title><FormattedMessage id="categories.edit"/></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Components.CategoriesEditForm category={category} closeCallback={this.closeModal} />
        </Modal.Body>
      </Modal>
    )
  }

  renderCategoryNewModal() {

    return (
      <Modal show={this.state.openModal === 0} onHide={this.closeModal}>
        <Modal.Header closeButton>
          <Modal.Title><FormattedMessage id="categories.new"/></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Components.CategoriesNewForm closeCallback={this.closeModal}/>
        </Modal.Body>
      </Modal>
    )
  }

  renderCategoryNewButton() {
    return (
      <div className="category-menu-item dropdown-item">
        <MenuItem>
          <Button bsStyle="primary" onClick={this.openCategoryNewModal}>
            <FormattedMessage id="categories.new"/>
          </Button>
        </MenuItem>
      </div>
    );
  }

  render() {

    const categories = this.props.results;

    const currentQuery = _.clone(this.props.router.location.query);
    delete currentQuery.cat;

    return (
      <div>
        <DropdownButton
          bsStyle="default"
          className="categories-list btn-secondary"
          title={<FormattedMessage id="categories"/>}
          id="categories-dropdown"
        >
          <div className="category-menu-item dropdown-item">
            <LinkContainer to={{pathname:"/", query: currentQuery}}>
              <MenuItem eventKey={0}>
                <FormattedMessage id="categories.all"/>
              </MenuItem>
            </LinkContainer>
          </div>
          {
            // categories data are loaded
            !this.props.loading ?
              // there are currently categories
              categories && categories.length > 0 ?
                categories.map((category, index) => <Components.Category key={index} category={category} index={index} openModal={_.partial(this.openCategoryEditModal, index)}/>)
              // not any category found
              : null
            // categories are loading
            : <div className="dropdown-item"><MenuItem><Components.Loading /></MenuItem></div>
          }
          <ShowIf check={Categories.options.mutations.new.check}>{this.renderCategoryNewButton()}</ShowIf>
        </DropdownButton>

        <div>
          {
            /*
              Modals cannot be inside DropdownButton component (see GH issue link on top of the file)
              -> we place them in a <div> outside the <DropdownButton> component
            */

            /* Modals for each category to edit */
            // categories data are loaded
            !this.props.loading ?
              // there are currently categories
              categories && categories.length > 0 ?
                categories.map((category, index) => this.renderCategoryEditModal(category, index))
              // not any category found
              : null
            // categories are loading
            : null
          }

          {
            /* modal for creating a new category */
            this.renderCategoryNewModal()
          }
        </div>
      </div>
    )

  }
}

CategoriesList.propTypes = {
  results: React.PropTypes.array,
};

CategoriesList.fragment = gql`
  fragment categoriesListFragment on Category {
    _id
    name
    description
    order
    slug
    image
  }
`;

const categoriesListOptions = {
  collection: Categories,
  queryName: 'categoriesListQuery',
  fragment: CategoriesList.fragment,
  limit: 0,
};

registerComponent('CategoriesList', CategoriesList, withRouter, withList(categoriesListOptions));
