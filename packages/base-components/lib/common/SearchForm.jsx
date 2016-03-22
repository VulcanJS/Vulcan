import React, { PropTypes, Component } from 'react';
import Formsy from 'formsy-react';
import FRC from 'formsy-react-components';

const Input = FRC.Input;

// see: http://stackoverflow.com/questions/1909441/jquery-keyup-delay
const delay = (function(){
  var timer = 0;
  return function(callback, ms){
    clearTimeout (timer);
    timer = setTimeout(callback, ms);
  };
})();

class SearchForm extends Component{

  constructor() {
    super();
    this.search = this.search.bind(this);
  }

  search(data) {

    if (FlowRouter.getRouteName() !== "posts.list") {
      FlowRouter.go("posts.list");
    }
    
    if (data.searchQuery === '') {
      data.searchQuery = null;
    }

    delay(function(){
      FlowRouter.setQueryParams({query: data.searchQuery});
    }, 700 );

  }

  render() {

    return (
      <div className="search-form">
        <Formsy.Form onChange={this.search}>
          <Input
            name="searchQuery"
            value=""
            label={this.props.labelText}
            type="text"
          />
        </Formsy.Form>
      </div>
    )
  }
}

SearchForm.propTypes = {
  labelText: React.PropTypes.string
}

SearchForm.defaultProps = {
  labelText: "Search"
};

module.exports = SearchForm;
export default SearchForm;