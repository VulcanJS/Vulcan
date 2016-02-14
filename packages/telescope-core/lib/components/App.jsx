App = React.createClass({

  // mixins: [ReactMeteorData],
  
  // getMeteorData() {

  //   var data = {
  //     ready: true
  //   };

  //   var handles = [
  //     Meteor.subscribe('site', SITE_KEY),
  //     Meteor.subscribe('toc'),
  //     Meteor.subscribe('chapters', BOOK_KEY),
  //     Meteor.subscribe('interviews', BOOK_KEY),
  //     Meteor.subscribe('videos', BOOK_KEY),
  //     Meteor.subscribe('thisUser'),
  //     Meteor.subscribe('pages'),
  //   ];

  //   if(_.every(handles, handle => {return handle.ready();})) {
  //     Session.set("book", Products.findOne({key: BOOK_KEY}));
  //     data.ready = true;
  //   }

  //   return data;
  // },


  render() {
    return this.props.content;
    // return this.data.ready ? this.props.content : <Loading/>;
  }

});