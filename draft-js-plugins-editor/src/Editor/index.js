/* eslint-disable no-continue,no-restricted-syntax */
import React, { Component } from 'react';
import {
  Editor,
  EditorState,
  DefaultDraftBlockRenderMap,
} from 'draft-js';
import { List, Map } from 'immutable';
import MultiDecorator from './MultiDecorator';
import createCompositeDecorator from './createCompositeDecorator';
import moveSelectionToEnd from './moveSelectionToEnd';
import proxies from './proxies';
import * as defaultKeyBindingPlugin from './defaultKeyBindingPlugin';

/**
 * The main editor component
 */
class PluginEditor extends Component {

  static propTypes = {
    editorState: React.PropTypes.object.isRequired,
    onChange: React.PropTypes.func.isRequired,
    plugins: React.PropTypes.array,
    defaultKeyBindings: React.PropTypes.bool,
    defaultBlockRenderMap: React.PropTypes.bool,
    customStyleMap: React.PropTypes.object,
    decorators: React.PropTypes.array,
  };

  static defaultProps = {
    defaultBlockRenderMap: true,
    defaultKeyBindings: true,
    customStyleMap: {},
    plugins: [],
    decorators: [],
  };

  constructor(props) {
    super(props);

    const plugins = [this.props, ...this.resolvePlugins()];
    for (const plugin of plugins) {
      if (typeof plugin.initialize !== 'function') continue;
      plugin.initialize(this.getPluginMethods());
    }

    // attach proxy methods like `focus` or `blur`
    for (const method of proxies) {
      this[method] = (...args) => (
        this.editor[method](...args)
      );
    }

    this.state = {}; // TODO for Nik: ask ben why this is relevent
  }

  componentWillMount() {
    const decorators = this.resolveDecorators();
    const compositeDecorator = createCompositeDecorator(
      decorators.filter((decorator) => !this.decoratorIsCustom(decorator)),
      this.getEditorState,
      this.onChange);

    const customDecorators = decorators
      .filter((decorator) => this.decoratorIsCustom(decorator));

    const multiDecorator = new MultiDecorator(
      [
        ...customDecorators,
        compositeDecorator,
      ]
    );

    const editorState = EditorState.set(this.props.editorState, { decorator: multiDecorator });
    this.onChange(moveSelectionToEnd(editorState));
  }

  componentWillUnmount() {
    this.resolvePlugins().forEach((plugin) => {
      if (plugin.willUnmount) {
        plugin.willUnmount({
          getEditorState: this.getEditorState,
          setEditorState: this.onChange,
        });
      }
    });
  }

  // Cycle through the plugins, changing the editor state with what the plugins
  // changed (or didn't)
  onChange = (editorState) => {
    let newEditorState = editorState;
    this.resolvePlugins().forEach((plugin) => {
      if (plugin.onChange) {
        newEditorState = plugin.onChange(newEditorState, this.getPluginMethods());
      }
    });

    if (this.props.onChange) {
      this.props.onChange(newEditorState, this.getPluginMethods());
    }
  };

  getPlugins = () => this.props.plugins.slice(0);
  getProps = () => ({ ...this.props });

  // TODO further down in render we use readOnly={this.props.readOnly || this.state.readOnly}. Ask Ben why readOnly is here just from the props? Why would plugins use this instead of just taking it from getProps?
  getReadOnly = () => this.props.readOnly;
  setReadOnly = (readOnly) => {
    if (readOnly !== this.state.readOnly) this.setState({ readOnly });
  };

  getEditorRef = () => this.editor;

  getEditorState = () => this.props.editorState;
  getPluginMethods = () => ({
    getPlugins: this.getPlugins,
    getProps: this.getProps,
    setEditorState: this.onChange,
    getEditorState: this.getEditorState,
    getReadOnly: this.getReadOnly,
    setReadOnly: this.setReadOnly,
    getEditorRef: this.getEditorRef,
  });

  createEventHooks = (methodName, plugins) => (...args) => {
    const newArgs = [].slice.apply(args);
    newArgs.push(this.getPluginMethods());
    for (const plugin of plugins) {
      if (typeof plugin[methodName] !== 'function') continue;
      const result = plugin[methodName](...newArgs);
      if (result === true) return true;
    }

    return false;
  };

  createHandleHooks = (methodName, plugins) => (...args) => {
    const newArgs = [].slice.apply(args);
    newArgs.push(this.getPluginMethods());
    for (const plugin of plugins) {
      if (typeof plugin[methodName] !== 'function') continue;
      const result = plugin[methodName](...newArgs);
      if (result === 'handled') return 'handled';
    }

    return 'not-handled';
  };

  createFnHooks = (methodName, plugins) => (...args) => {
    const newArgs = [].slice.apply(args);

    newArgs.push(this.getPluginMethods());

    if (methodName === 'blockRendererFn') {
      let block = { props: {} };
      for (const plugin of plugins) {
        if (typeof plugin[methodName] !== 'function') continue;
        const result = plugin[methodName](...newArgs);
        if (result !== undefined && result !== null) {
          const { props: pluginProps, ...pluginRest } = result; // eslint-disable-line no-use-before-define
          const { props, ...rest } = block; // eslint-disable-line no-use-before-define
          block = { ...rest, ...pluginRest, props: { ...props, ...pluginProps } };
        }
      }

      return block.component ? block : false;
    } else if (methodName === 'blockStyleFn') {
      let styles;
      for (const plugin of plugins) {
        if (typeof plugin[methodName] !== 'function') continue;
        const result = plugin[methodName](...newArgs);
        if (result !== undefined && result !== null) {
          styles = (styles ? (`${styles} `) : '') + result;
        }
      }

      return styles || false;
    }

    for (const plugin of plugins) {
      if (typeof plugin[methodName] !== 'function') continue;
      const result = plugin[methodName](...newArgs);
      if (result !== undefined) {
        return result;
      }
    }

    return false;
  };

  createPluginHooks = () => {
    const pluginHooks = {};
    const eventHookKeys = [];
    const handleHookKeys = [];
    const fnHookKeys = [];
    const plugins = [this.props, ...this.resolvePlugins()];

    plugins.forEach((plugin) => {
      Object.keys(plugin).forEach((attrName) => {
        if (attrName === 'onChange') return;

        // if `attrName` has been added as a hook key already, ignore this one
        if (eventHookKeys.indexOf(attrName) !== -1 || fnHookKeys.indexOf(attrName) !== -1) return;

        const isEventHookKey = attrName.indexOf('on') === 0;
        if (isEventHookKey) {
          eventHookKeys.push(attrName);
          return;
        }

        const isHandleHookKey = attrName.indexOf('handle') === 0;
        if (isHandleHookKey) {
          handleHookKeys.push(attrName);
          return;
        }

        // checks if `attrName` ends with 'Fn'
        const isFnHookKey = (attrName.length - 2 === attrName.indexOf('Fn'));
        if (isFnHookKey) {
          fnHookKeys.push(attrName);
        }
      });
    });

    eventHookKeys.forEach((attrName) => {
      pluginHooks[attrName] = this.createEventHooks(attrName, plugins);
    });

    handleHookKeys.forEach((attrName) => {
      pluginHooks[attrName] = this.createHandleHooks(attrName, plugins);
    });

    fnHookKeys.forEach((attrName) => {
      pluginHooks[attrName] = this.createFnHooks(attrName, plugins);
    });

    return pluginHooks;
  };

  resolvePlugins = () => {
    const plugins = this.props.plugins.slice(0);
    if (this.props.defaultKeyBindings) {
      plugins.push(defaultKeyBindingPlugin);
    }

    return plugins;
  };

  resolveDecorators = () => {
    const { decorators, plugins } = this.props;
    return List([{ decorators }, ...plugins])
      .filter((plugin) => plugin.decorators !== undefined)
      .flatMap((plugin) => plugin.decorators);
  };

  // Return true if decorator implements the DraftDecoratorType interface
  // @see https://github.com/facebook/draft-js/blob/master/src/model/decorators/DraftDecoratorType.js
  decoratorIsCustom = (decorator) => typeof decorator.getDecorations === 'function' &&
    typeof decorator.getComponentForKey === 'function' &&
    typeof decorator.getPropsForKey === 'function';


  resolveCustomStyleMap = () => (
    this.props.plugins
      .filter((plug) => plug.customStyleMap !== undefined)
      .map((plug) => plug.customStyleMap)
      .concat([this.props.customStyleMap])
      .reduce((styles, style) => (
        {
          ...styles,
          ...style,
        }
      ), {})
  );

  resolveblockRenderMap = () => {
    let blockRenderMap = this.props.plugins
      .filter((plug) => plug.blockRenderMap !== undefined)
      .reduce((maps, plug) => maps.merge(plug.blockRenderMap), Map({}));
    if (this.props.defaultBlockRenderMap) {
      blockRenderMap = DefaultDraftBlockRenderMap.merge(blockRenderMap);
    }
    if (this.props.blockRenderMap) {
      blockRenderMap = blockRenderMap.merge(this.props.blockRenderMap);
    }
    return blockRenderMap;
  }

  resolveAccessibilityProps = () => {
    let accessibilityProps = {};
    const plugins = [this.props, ...this.resolvePlugins()];
    for (const plugin of plugins) {
      if (typeof plugin.getAccessibilityProps !== 'function') continue;
      const props = plugin.getAccessibilityProps();
      const popupProps = {};

      if (accessibilityProps.ariaHasPopup === undefined) {
        popupProps.ariaHasPopup = props.ariaHasPopup;
      } else if (props.ariaHasPopup === 'true') {
        popupProps.ariaHasPopup = 'true';
      }

      if (accessibilityProps.ariaExpanded === undefined) {
        popupProps.ariaExpanded = props.ariaExpanded;
      } else if (props.ariaExpanded === 'true') {
        popupProps.ariaExpanded = 'true';
      }

      accessibilityProps = {
        ...accessibilityProps,
        ...props,
        ...popupProps,
      };
    }

    return accessibilityProps;
  };

  render() {
    const pluginHooks = this.createPluginHooks();
    const customStyleMap = this.resolveCustomStyleMap();
    const accessibilityProps = this.resolveAccessibilityProps();
    const blockRenderMap = this.resolveblockRenderMap();
    return (
      <Editor
        {...this.props}
        {...accessibilityProps}
        {...pluginHooks}
        readOnly={this.props.readOnly || this.state.readOnly}
        customStyleMap={customStyleMap}
        blockRenderMap={blockRenderMap}
        onChange={this.onChange}
        editorState={this.props.editorState}
        ref={(element) => { this.editor = element; }}
      />
    );
  }
}

export default PluginEditor;
