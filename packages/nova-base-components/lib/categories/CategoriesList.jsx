import Telescope from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, DropdownButton, MenuItem, Modal } from 'react-bootstrap';
import { /* ModalTrigger, */ ContextPasser } from "meteor/nova:core";
import { withRouter } from 'react-router'
import { LinkContainer } from 'react-router-bootstrap';
import Users from 'meteor/nova:users';

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
          <ContextPasser currentUser={this.context.currentUser} messages={this.context.messages} actions={this.context.actions} closeCallback={this.closeModal}>
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
          <ContextPasser currentUser={this.context.currentUser} messages={this.context.messages} closeCallback={this.closeModal}>
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
    
    const categories = this.props.categories;
    const context = this.context;
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
          {categories && categories.length > 0 ? categories.map((category, index) => <Telescope.components.Category key={index} category={category} index={index} openModal={_.partial(this.openCategoryEditModal, index)}/>) : null}
          {this.renderCategoryNewButton()}
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
  actions: React.PropTypes.object,
  currentUser: React.PropTypes.object,
  messages: React.PropTypes.object,
};

module.exports = withRouter(CategoriesList);
export default withRouter(CategoriesList);