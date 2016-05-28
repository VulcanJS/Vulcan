import React, { PropTypes, Component } from 'react';
import { Button, DropdownButton, MenuItem, Modal } from 'react-bootstrap';
import Router from "../router.js"
import { ModalTrigger, ContextPasser } from "meteor/nova:core";

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
          <Modal.Title>Edit Category</Modal.Title>
        </Modal.Header>        
        <Modal.Body>
          <ContextPasser currentUser={this.context.currentUser} closeCallback={this.closeModal}>
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
          <Modal.Title>New Category</Modal.Title>
        </Modal.Header>        
        <Modal.Body>
          <ContextPasser currentUser={this.context.currentUser} closeCallback={this.closeModal}>
            <Telescope.components.CategoriesNewForm/>
          </ContextPasser>
        </Modal.Body>
      </Modal>
    )
  }

  renderCategoryNewButton() {
    return <div className="category-menu-item dropdown-item"><MenuItem><Button bsStyle="primary" onClick={this.openCategoryNewModal}>New Category</Button></MenuItem></div>;
    // const CategoriesNewForm = Telescope.components.CategoriesNewForm;
    // return (
    //   <ModalTrigger title="New Category" component={<MenuItem className="dropdown-item post-category"><Button bsStyle="primary">New Category</Button></MenuItem>}>
    //     <CategoriesNewForm/>
    //   </ModalTrigger>
    // )
  }

  render() {
    
    const categories = this.props.categories;
    const context = this.context;

    const currentRoute = context.currentRoute;
    const currentCategorySlug = currentRoute.queryParams.cat;
    
    return (
      <div>
        <DropdownButton 
          bsStyle="default" 
          className="categories-list btn-secondary" 
          title="Categories" 
          id="categories-dropdown"
        >
          <div className="category-menu-item dropdown-item"><MenuItem href={Router.path("posts.list")} eventKey={0}>All Categories</MenuItem></div>
          {categories && categories.length > 0 ? categories.map((category, index) => <Telescope.components.Category key={index} category={category} index={index} currentCategorySlug={currentCategorySlug} openModal={_.partial(this.openCategoryEditModal, index)}/>) : null}
          {Users.is.admin(this.context.currentUser) ? this.renderCategoryNewButton() : null}
        </DropdownButton>
        <div>
          {/* modals cannot be inside DropdownButton component (see GH issue) */}
          {categories && categories.length > 0 ? categories.map((category, index) => this.renderCategoryEditModal(category, index)) : null}
          {this.renderCategoryNewModal()}
        </div>
      </div>
    )

  }
};

CategoriesList.propTypes = {
  categories: React.PropTypes.array
}

CategoriesList.contextTypes = {
  currentUser: React.PropTypes.object,
  currentRoute: React.PropTypes.object
};

module.exports = CategoriesList;
export default CategoriesList;