App = React.createClass({

  mixins: [ReactMeteorData],
  
  getMeteorData() {

    var data = {
      ready: true
    };

    var handles = Telescope.subscriptions.map((sub) => Meteor.subscribe(sub.name, sub.arguments));

    if(!!handles.length && _.every(handles, handle => handle.ready())) {
      data.ready = true;
    }

    return data;
  },


  render() {
    if (this.data.ready) {

      return (
        <div>
          <a href={FlowRouter.path("newPost")}>New Post</a>
          <hr/>
          {this.props.content}
        </div>
      )
    } else {
      return <p>Loading App…</p>
    }

    // return this.data.ready ? this.props.content : <Loading/>;
  }

});