import React, { PureComponent } from 'react';
import ReactTagInput from 'react-tag-input';
import PropTypes from 'prop-types';

const ReactTags = ReactTagInput.WithContext;

class Tags extends PureComponent {

  constructor(props) {
    super(props);

    this.suggestions = (props.options || []).map(
      ({ value, label }) => ({ id: value, text: label })
    );
    const tags = (props.value || []).map(id => (
      // tolerate cases when a tag is not found in suggestions (create a tag on the fly)
      this.suggestions.find(suggestion => id === suggestion.id) || { id, text: id }
    ));

    this.state = { tags };
  }

  handleChange = reducer => value => {
    const tags = reducer(this.state.tags, value);
    this.setState({ tags });
    this.props.inputProperties.onChange(this.props.name, tags.map(({ id }) => id));
  }

  render() {
    return (
      <div className="form-group row">
        <label className="control-label col-sm-3">{this.props.label}</label>
        <div className="col-sm-9">
          <div className="tags-field">
            <ReactTags
              tags={this.state.tags}
              suggestions={this.suggestions}
              handleDelete={this.handleChange(
                (tags, index) => [...tags.slice(0, index), ...tags.slice(index + 1)]
              )}
              handleAddition={this.handleChange((tags, newTag) => [...tags, newTag])}
              minQueryLength={1}
            />
          </div>
        </div>
      </div>
    );
  }
}

Tags.propTypes = {
  name: PropTypes.string,
  value: PropTypes.any,
  label: PropTypes.string,
  inputProperties: PropTypes.shape({
    onChange: PropTypes.func,
  }),
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.any,
      label: PropTypes.string,
    })
  ),
};

export default Tags;
