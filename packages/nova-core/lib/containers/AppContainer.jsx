const AppContainer = React.createClass({

  mixins: [ReactMeteorData],
  
  getMeteorData() {

    var data = {
      currentUser: Meteor.user(),
      ready: false
    };

    var handles = Telescope.subscriptions.map((sub) => Meteor.subscribe(sub.name, sub.arguments));

    if(!handles.length || _.every(handles, handle => handle.ready())) {
      data.ready = true;
    }

    return data;
  },


  render() {
    
    const Layout = Telescope.getComponent("Layout");

    if (this.data.ready) {
      return <Layout currentUser={this.data.currentUser}>{this.props.content}</Layout>
    } else {
      return <p>Loading App…</p>
    }

    // return this.data.ready ? this.props.content : <Loading/>;
  }

});

module.exports = AppContainer;
export default AppContainer;