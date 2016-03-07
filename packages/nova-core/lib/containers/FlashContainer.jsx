import Messages from "../messages.js";

const FlashContainer = React.createClass({

  mixins: [ReactMeteorData],
  
  getMeteorData() {
    return {
      messages: Messages.collection.find({show: true}).fetch()
    };
  },

  render() {
    
    ({Flash} = Telescope.components);

    return (
      <div className="flash-messages">
        {this.data.messages.map((message, index) => <Flash key={index} message={message} />)}
      </div>
    );

  }

});

module.exports = FlashContainer;
export default FlashContainer;