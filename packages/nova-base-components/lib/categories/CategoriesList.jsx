import Telescope from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, DropdownButton, MenuItem, Modal } from 'react-bootstrap';
import { /* ModalTrigger, */ ContextPasser, withList } from "meteor/nova:core";
import { withRouter } from 'react-router'
import { LinkContainer } from 'react-router-bootstrap';
import Users from 'meteor/nova:users';
import Categories from 'meteor/nova:categories';

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
          <ContextPasser closeCallback={this.closeModal}>
            <Telescope.components.CategoriesEditForm category={category}/>
          </ContextPasser>
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
          <ContextPasser closeCallback={this.closeModal}>
            <Telescope.components.CategoriesNewForm/>
          </ContextPasser>
        </Modal.Body>
      </Modal>
    )
  }

  renderCategoryNewButton() {
    return (
      <Telescope.components.CanDo action="categories.new">
        <div className="category-menu-item dropdown-item"><MenuItem><Button bsStyle="primary" onClick={this.openCategoryNewModal}><FormattedMessage id="categories.new"/></Button></MenuItem></div>
      </Telescope.components.CanDo>
    );
    // const CategoriesNewForm = Telescope.components.CategoriesNewForm;
    // return (
    //   <ModalTrigger title="New Category" component={<MenuItem className="dropdown-item post-category"><Button bsStyle="primary">New Category</Button></MenuItem>}>
    //     <CategoriesNewForm/>
    //   </ModalTrigger>
    // )
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
                categories.map((category, index) => <Telescope.components.Category key={index} category={category} index={index} openModal={_.partial(this.openCategoryEditModal, index)}/>) 
              // not any category found
              : null
            // categories are loading
            : <div className="dropdown-item"><MenuItem><Telescope.components.Loading /></MenuItem></div>
          }
          {this.renderCategoryNewButton()}
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
};

CategoriesList.propTypes = {
  results: React.PropTypes.array,
};

const categoriesListOptions = {
  collection: Categories,
  queryName: 'getCategoriesList'
};

Telescope.registerComponent('CategoriesList', CategoriesList, withRouter);
// Telescope.registerComponent('CategoriesList', CategoriesList, withRouter, withList(categoriesListOptions));
