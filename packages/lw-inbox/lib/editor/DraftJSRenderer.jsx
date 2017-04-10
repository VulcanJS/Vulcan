import React, { PropTypes, Component } from 'react';
import { Components, registerComponent, withCurrentUser } from 'meteor/vulcan:core';
import redraft, { Atomic } from 'redraft';


class DraftJSRenderer extends Component {

  renderWarning() {
    return <div>Nothing to render.</div>;
  };

  render() {

    /**
     *  You can use inline styles or classNames inside your callbacks
     */
    const styles = {
      code: {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
        fontSize: 16,
        padding: 2,
      },
      codeBlock: {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
        fontSize: 16,
        padding: 20,
      },
    };

    // just a helper to add a <br /> after a block
    const addBreaklines = (children) => children.map(child => [child, <br />]);

    /**
     * Define the renderers
     */
    const renderers = {
      /**
       * Those callbacks will be called recursively to render a nested structure
       */
      inline: {
        // The key passed here is just an index based on rendering order inside a block
        BOLD: (children, { key }) => <strong key={key}>{children}</strong>,
        ITALIC: (children, { key }) => <em key={key}>{children}</em>,
        UNDERLINE: (children, { key }) => <u key={key}>{children}</u>,
        CODE: (children, { key }) => <span key={key} style={styles.code}>{children}</span>,
      },
      /**
       * Blocks receive children and depth
       * Note that children are an array of blocks with same styling,
       */
      blocks: {
        unstyled: (children) => children.map(child => <p>{child}</p>),
        blockquote: (children) => <blockquote >{addBreaklines(children)}</blockquote>,
        'header-one': (children) => children.map(child => <h1>{child}</h1>),
        'header-two': (children) => children.map(child => <h2>{child}</h2>),
        // You can also access the original keys of the blocks
        'code-block': (children, { keys }) => <pre style={styles.codeBlock} key={keys[0]} >{addBreaklines(children)}</pre>,
        // or depth for nested lists
        'unordered-list-item': (children, { depth, keys }) => <ul key={keys[keys.length - 1]} class={`ul-level-${depth}`}>{children.map(child => <li>{child}</li>)}</ul>,
        'ordered-list-item': (children, { depth, keys }) => <ol key={keys.join('|')} class={`ol-level-${depth}`}>{children.map((child, index)=> <li key={keys[index]}>{child}</li>)}</ol>,
        // If your blocks use meta data it can also be accessed like keys
        atomic: (children, { keys, data }) => children.map((child, i) => <Atomic key={keys[i]} {...data[i]} />),
      },
      /**
       * Entities receive children and the entity data
       */
      entities: {
        // key is the entity key value from raw
        LINK: (children, data, { key }) => <Link key={key} to={data.url} {...children} />,
      },
    };

    const raw = this.props.draftJS;

    if (!raw) {
     return this.renderWarning();
    };
    const rendered = redraft(raw, renderers);
    // redraft returns a null if there's nothing to render
    if (!rendered) {
      return this.renderWarning();
    };
    return (
      <div>
        {rendered}
      </div>
    );
  };


};

class MessageEditor extends Component {

  render() {


    const document = this.props.document;
    const addValues = this.context.addToAutofilledValues;

    return (
      <div className="messageEditor">
        <Components.EditorWrapper addValues={addValues}/>
      </div>
    );
  }
};

registerComponent('DraftJSRenderer', DraftJSRenderer, withCurrentUser);
