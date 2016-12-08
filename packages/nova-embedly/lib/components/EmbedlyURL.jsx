import { Components } from 'meteor/nova:lib';
import { withMutation } from 'meteor/nova:core';
import React, { PropTypes, Component } from 'react';
import FRC from 'formsy-react-components';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const Input = FRC.Input;

class EmbedlyURL extends Component {

  constructor() {
    super();
    this.handleBlur = this.handleBlur.bind(this);
    this.state = {
      loading: false
    }
  }

  // called whenever the URL input field loses focus
  handleBlur() {

    this.setState({loading: true});

    const url = this.input.getValue();

    if (url.length) {
      // the URL has changed, get a new thumbnail
      this.props.getEmbedlyData({url}).then(result => {
        this.setState({loading: false});
        console.log('Embedly Data', result);
        this.context.addToAutofilledValues({
          title: result.data.getEmbedlyData.title,
          body: result.data.getEmbedlyData.description,
          thumbnailUrl: result.data.getEmbedlyData.thumbnailUrl
        });
      }).catch(error => {
        this.setState({loading: false});
        console.log(error)
        this.context.throwError({content: error.message, type: "error"});
      });
    }
  }

  render() {

    const wrapperStyle = {
      position: "relative"
    };

    const loadingStyle = {
      position: "absolute",
      pointerEvents: "none",
      top: "15px",
      right: "15px"
    };

    loadingStyle.display = this.state.loading ? "block" : "none";

    // see https://facebook.github.io/react/warnings/unknown-prop.html
    const {document, updateCurrentValue, control, getEmbedlyData, ...rest} = this.props;

    return (
      <div className="embedly-url-field" style={wrapperStyle}>
        <Input
          {...rest}
          onBlur={this.handleBlur}
          type="text"
          ref={ref => this.input = ref}
        />
        <div className="embedly-url-field-loading" style={loadingStyle}>
          <Components.Loading />
        </div>
      </div>
    );
  }
}

EmbedlyURL.propTypes = {
  name: React.PropTypes.string,
  value: React.PropTypes.any,
  label: React.PropTypes.string
}

EmbedlyURL.contextTypes = {
  addToAutofilledValues: React.PropTypes.func,
  throwError: React.PropTypes.func,
  actions: React.PropTypes.object,
}

// note: not used since we use `withMutation` and getEmbedlyData returns a `JSON` type
// function withGetEmbedlyData() {
//   return graphql(gql`
//     mutation getEmbedlyData($url: String) {
//       getEmbedlyData(url: $url) {
//         title
//         media
//         description
//         thumbnailUrl
//         sourceName
//         sourceUrl
//       }
//     }
//   `, {
//     name: 'getEmbedlyData'
//   });
// }


export default withMutation({
  name: 'getEmbedlyData',
  args: {url: 'String'},
})(EmbedlyURL);
