import React, { PropTypes, Component } from 'react';
import { intlShape } from 'react-intl';
import Router from '../router.js'
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

    if (Router.getRouteName() !== "posts.list") {
      // Router.go("posts.list");
    }
    
    if (data.searchQuery === '') {
      data.searchQuery = null;
    }

    delay(function(){
      // Router.setQueryParams({query: data.searchQuery});
    }, 700 );

  }

  render() {

    const currentQuery = "foo";

    return (
      <div className="search-form">
        <Formsy.Form onChange={this.search}>
          <Input
            name="searchQuery"
            value={currentQuery}
            placeholder={this.context.intl.formatMessage({id: "posts.search"})}
            type="text"
            layout="elementOnly"
          />
        </Formsy.Form>
      </div>
    )
  }
}

SearchForm.contextTypes = {
  currentRoute: React.PropTypes.object,
  currentUser: React.PropTypes.object,
  intl: intlShape
}

module.exports = SearchForm;
export default SearchForm;