import React, { PureComponent } from 'react';
import AdminUsersList from './AdminUsersList.jsx';

// see: http://stackoverflow.com/questions/1909441/jquery-keyup-delay
const delay = (function(){
  var timer = 0;
  return function(callback, ms){
    clearTimeout (timer);
    timer = setTimeout(callback, ms);
  };
})();

export default class AdminUsers extends PureComponent {

  constructor() {
    super();
    this.updateQuery = this.updateQuery.bind(this);
    this.state = {
      value: '',
      query: ''
    }
  }

  updateQuery(e) {
    e.persist()
    e.preventDefault();
    this.setState({
      value: e.target.value
    });
    delay(() => {
      this.setState({
        query: e.target.value
      });
    }, 700 );
  }

  render() {
    return (
      <div className="admin-users">
        <input className="admin-users-search" placeholder="Search…" type="text" name="adminUsersQuery" value={this.state.value} onChange={this.updateQuery} />
        <AdminUsersList terms={{query: this.state.query}} />
      </div>
    )
  }
}

