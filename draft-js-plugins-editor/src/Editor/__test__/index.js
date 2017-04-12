import React, { Component } from 'react';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';
import { EditorState, DefaultDraftBlockRenderMap, Editor } from 'draft-js';
import { Map } from 'immutable';
import sinon from 'sinon';
import PluginEditor, { createEditorStateWithText } from '../../index';

/* For use in integration tests, as in where you need to test the
 * Editor component as well */
class TestEditor extends Component {
  state = { };

  componentWillMount() {
    this.state.editorState = createEditorStateWithText(this.props.text);
  }

  onChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  render() {
    return (
      <PluginEditor
        {...this.props}
        editorState={this.state.editorState}
        onChange={this.onChange}
      />
    );
  }
}

describe('Editor', () => {
  describe('renders the Editor', () => {
    const changeSpy = sinon.spy();
    let editorState;

    beforeEach(() => {
      editorState = EditorState.createEmpty();
    });

    it('with an empty plugins list provided', () => {
      const result = mount(
        <PluginEditor
          editorState={editorState}
          onChange={changeSpy}
          plugins={[]}
        />
      );
      expect(result.node.props.onChange).to.eq(changeSpy);
      expect(result.node.props.editorState).to.eq(editorState);
    });

    it('without the plugins property provided', () => {
      const result = mount(
        <PluginEditor
          editorState={editorState}
          onChange={changeSpy}
        />
      );
      expect(result.node.props.onChange).to.eq(changeSpy);
      expect(result.node.props.editorState).to.eq(editorState);
    });

    it('with a plugin provided', () => {
      const createCustomPlugin = () => ({});
      const customPlugin = createCustomPlugin();
      const plugins = [customPlugin];
      const result = mount(
        <PluginEditor
          editorState={editorState}
          onChange={changeSpy}
          plugins={plugins}
        />
      );
      expect(result.node.props.onChange).to.eq(changeSpy);
      expect(result.node.props.editorState).to.eq(editorState);
    });

    it('and by default adds the defaultKeyBindings plugin', () => {
      const result = mount(
        <PluginEditor
          editorState={editorState}
          onChange={changeSpy}
        />
      );
      const pluginEditor = result.instance();
      expect(pluginEditor.resolvePlugins()[0]).to.include.keys('keyBindingFn');
    });

    it('without the defaultKeyBindings plugin if deactivated', () => {
      const result = mount(
        <PluginEditor
          editorState={editorState}
          onChange={changeSpy}
          defaultKeyBindings={false}
        />
      );
      const pluginEditor = result.instance();
      expect(pluginEditor.resolvePlugins()).to.have.lengthOf(0);
    });
  });

  describe('with plugins', () => {
    let changeSpy;
    let editorState;

    beforeEach(() => {
      editorState = EditorState.createEmpty();
      changeSpy = sinon.spy();
    });

    it('calls the on-hooks of the plugin', () => {
      const plugins = [
        {
          onUpArrow: sinon.spy(),
          onDragEnter: sinon.spy(),
          onEscape: sinon.spy(),
          onTab: sinon.spy(),
          onChange: sinon.spy(),
        },
      ];
      const result = shallow(
        <PluginEditor
          editorState={editorState}
          onChange={changeSpy}
          plugins={plugins}
        />
      );

      const draftEditor = result.node;
      const plugin = plugins[0];
      draftEditor.props.onUpArrow();
      expect(plugin.onUpArrow).has.been.calledOnce();
      draftEditor.props.onDragEnter();
      expect(plugin.onDragEnter).has.been.calledOnce();
      draftEditor.props.onEscape();
      expect(plugin.onEscape).has.been.calledOnce();
      draftEditor.props.onTab();
      expect(plugin.onTab).has.been.calledOnce();
      draftEditor.props.onChange(editorState);

      // is called twice since componentWillMount injects the decorators and calls onChange again
      expect(plugin.onChange).has.been.calledTwice();
    });

    it('calls the handle-hooks of the plugin', () => {
      const plugins = [
        {
          handleKeyCommand: sinon.spy(),
          handlePastedText: sinon.spy(),
          handleReturn: sinon.spy(),
          handleDrop: sinon.spy(),
        },
      ];
      const result = shallow(
        <PluginEditor
          editorState={editorState}
          onChange={changeSpy}
          plugins={plugins}
        />
      );

      const pluginEditor = result.instance();
      const draftEditor = result.node;
      const plugin = plugins[0];
      const expectedSecondArgument = {
        getEditorState: pluginEditor.getEditorState,
        setEditorState: pluginEditor.onChange,
        getPlugins: pluginEditor.getPlugins,
        getProps: pluginEditor.getProps,
        getReadOnly: pluginEditor.getReadOnly,
        setReadOnly: pluginEditor.setReadOnly,
        getEditorRef: pluginEditor.getEditorRef,
      };
      draftEditor.props.handleKeyCommand('command');
      expect(plugin.handleKeyCommand).has.been.calledOnce();
      expect(plugin.handleKeyCommand).has.been.calledWith('command', expectedSecondArgument);
      draftEditor.props.handlePastedText('command');
      expect(plugin.handlePastedText).has.been.calledOnce();
      expect(plugin.handlePastedText).has.been.calledWith('command', expectedSecondArgument);
      draftEditor.props.handleReturn('command');
      expect(plugin.handleReturn).has.been.calledOnce();
      expect(plugin.handleReturn).has.been.calledWith('command', expectedSecondArgument);
      draftEditor.props.handleDrop('command');
      expect(plugin.handleDrop).has.been.calledOnce();
      expect(plugin.handleDrop).has.been.calledWith('command', expectedSecondArgument);
    });

    it('calls willUnmount', () => {
      const plugins = [
        {
          willUnmount: sinon.spy(),
        },
      ];
      const result = mount(
        <PluginEditor
          editorState={editorState}
          onChange={changeSpy}
          plugins={plugins}
        />
      );

      const pluginEditor = result.node;
      const plugin = plugins[0];
      const expectedArgument = {
        getEditorState: pluginEditor.getEditorState,
        setEditorState: pluginEditor.onChange,
      };
      result.unmount();

      expect(plugin.willUnmount).has.been.calledOnce();
      expect(plugin.willUnmount).has.been.calledWith(expectedArgument);
    });

    it('calls the handle- and on-hooks of the first plugin and not the second in case it was handeled', () => {
      const plugins = [
        {
          handleKeyCommand: sinon.stub().returns('handled'),
          onUpArrow: sinon.stub().returns(true),
        },
        {
          handleKeyCommand: sinon.spy(),
          onUpArrow: sinon.spy(),
        },
      ];
      const result = shallow(
        <PluginEditor
          editorState={editorState}
          onChange={changeSpy}
          plugins={plugins}
        />
      );

      const draftEditor = result.node;
      draftEditor.props.handleKeyCommand('command');
      expect(plugins[0].handleKeyCommand).has.been.calledOnce();
      expect(plugins[1].handleKeyCommand).has.not.been.called();

      draftEditor.props.onUpArrow();
      expect(plugins[0].onUpArrow).has.been.calledOnce();
      expect(plugins[1].onUpArrow).has.not.been.called();
    });

    it('calls the handle- and on-hooks of all plugins in case none handeles the command', () => {
      const plugins = [
        {
          handleKeyCommand: sinon.spy(),
          onUpArrow: sinon.spy(),
        },
        {
          handleKeyCommand: sinon.spy(),
          onUpArrow: sinon.spy(),
        },
        {
          handleKeyCommand: sinon.spy(),
          onUpArrow: sinon.spy(),
        },
      ];
      const result = shallow(
        <PluginEditor
          editorState={editorState}
          onChange={changeSpy}
          plugins={plugins}
        />
      );

      const draftEditor = result.node;
      draftEditor.props.handleKeyCommand('command');
      expect(plugins[0].handleKeyCommand).has.been.calledOnce();
      expect(plugins[1].handleKeyCommand).has.been.calledOnce();
      expect(plugins[2].handleKeyCommand).has.been.calledOnce();

      draftEditor.props.onUpArrow();
      expect(plugins[0].onUpArrow).has.been.calledOnce();
      expect(plugins[1].onUpArrow).has.been.calledOnce();
      expect(plugins[2].onUpArrow).has.been.calledOnce();
    });

    it('calls the fn-hooks of the plugin', () => {
      const plugins = [
        {
          blockRendererFn: sinon.spy(),
          keyBindingFn: sinon.spy(),
        },
      ];
      const result = shallow(
        <PluginEditor
          editorState={editorState}
          onChange={changeSpy}
          plugins={plugins}
        />
      );

      const pluginEditor = result.instance();
      const draftEditor = result.node;
      const plugin = plugins[0];
      const expectedSecondArgument = {
        getEditorState: pluginEditor.getEditorState,
        setEditorState: pluginEditor.onChange,
        getPlugins: pluginEditor.getPlugins,
        getProps: pluginEditor.getProps,
        getReadOnly: pluginEditor.getReadOnly,
        setReadOnly: pluginEditor.setReadOnly,
        getEditorRef: pluginEditor.getEditorRef,
      };
      draftEditor.props.blockRendererFn('command');
      expect(plugin.blockRendererFn).has.been.calledOnce();
      expect(plugin.blockRendererFn).has.been.calledWith('command', expectedSecondArgument);
      draftEditor.props.keyBindingFn('command');
      expect(plugin.keyBindingFn).has.been.calledOnce();
      expect(plugin.keyBindingFn).has.been.calledWith('command', expectedSecondArgument);
    });

    it('combines the customStyleMaps from all plugins', () => {
      const plugins = [
        {
          customStyleMap: {
            orange: {
              color: 'rgba(255, 127, 0, 1.0)',
            },
          },
        },
        {
          customStyleMap: {
            yellow: {
              color: 'rgba(180, 180, 0, 1.0)',
            },
          },
        },
      ];
      const result = mount(
        <PluginEditor
          editorState={editorState}
          onChange={changeSpy}
          plugins={plugins}
        />
      );
      const expected = {
        orange: {
          color: 'rgba(255, 127, 0, 1.0)',
        },
        yellow: {
          color: 'rgba(180, 180, 0, 1.0)',
        },
      };
      const pluginEditor = result.instance();
      expect(pluginEditor.resolveCustomStyleMap()).to.deep.equal(expected);
    });

    it('combines customStyleMap props from plugins and the editor', () => {
      const plugins = [
        {
          customStyleMap: {
            orange: {
              color: 'rgba(255, 127, 0, 1.0)',
            },
          },
        },
        {
          customStyleMap: {
            yellow: {
              color: 'rgba(180, 180, 0, 1.0)',
            },
          },
        },
      ];

      const customStyleMap = {
        blue: {
          color: 'blue',
        },
      };

      const result = mount(
        <PluginEditor
          editorState={editorState}
          customStyleMap={customStyleMap}
          onChange={changeSpy}
          plugins={plugins}
        />
      );

      const expected = {
        orange: {
          color: 'rgba(255, 127, 0, 1.0)',
        },
        yellow: {
          color: 'rgba(180, 180, 0, 1.0)',
        },
        blue: {
          color: 'blue',
        },
      };
      const pluginEditor = result.instance();
      expect(pluginEditor.resolveCustomStyleMap()).to.deep.equal(expected);
    });

    it('combines customStyleMap props from plugins and the editor', () => {
      const plugins = [
        {
          customStyleMap: {
            orange: {
              color: 'rgba(255, 127, 0, 1.0)',
            },
          },
        },
        {
          customStyleMap: {
            yellow: {
              color: 'rgba(180, 180, 0, 1.0)',
            },
          },
        },
      ];

      const customStyleMap = {
        blue: {
          color: 'blue',
        },
      };

      const result = mount(
        <PluginEditor
          editorState={editorState}
          customStyleMap={customStyleMap}
          onChange={changeSpy}
          plugins={plugins}
        />
      );

      const expected = {
        orange: {
          color: 'rgba(255, 127, 0, 1.0)',
        },
        yellow: {
          color: 'rgba(180, 180, 0, 1.0)',
        },
        blue: {
          color: 'blue',
        },
      };
      const pluginEditor = result.instance();
      expect(pluginEditor.resolveCustomStyleMap()).to.deep.equal(expected);
    });

    it('combines the blockRenderMap from all plugins', () => {
      const plugins = [
        {
          blockRenderMap: Map({ sticker: { element: 'div' } }),
        },
        {
          blockRenderMap: Map({ test: { element: 'test' } }),
        },
      ];
      const result = mount(
        <PluginEditor
          editorState={editorState}
          onChange={changeSpy}
          plugins={plugins}
        />
      );
      const expected = DefaultDraftBlockRenderMap.merge(Map({
        sticker: { element: 'div' },
        test: { element: 'test' },
      }));
      const pluginEditor = result.instance();
      expect(pluginEditor.resolveblockRenderMap()).to.deep.equal(expected);
    });

    it('combines blockRenderMap props from plugins and the editor', () => {
      const plugins = [
        {
          blockRenderMap: Map({ sticker: { element: 'div' } }),
        },
        {
          blockRenderMap: Map({ test: { element: 'test' } },
        ),
        },
      ];

      const customBlockRenderMap = Map({ sticker: { element: 'customDiv' } });

      const result = mount(
        <PluginEditor
          editorState={editorState}
          blockRenderMap={customBlockRenderMap}
          onChange={changeSpy}
          plugins={plugins}
        />
      );

      const expected = DefaultDraftBlockRenderMap.merge(Map({
        sticker: { element: 'customDiv' },
        test: { element: 'test' },
      }));

      const pluginEditor = result.instance();
      expect(pluginEditor.resolveblockRenderMap()).to.deep.equal(expected);
    });

    it('returns the component reference when we call the getEditorRef inside of a plugin', () => {
      const spy = sinon.spy();
      const plugins = [{
        onChange: (state, pluginFunctions) => spy(pluginFunctions.getEditorRef())
      }];
      const pluginEditorComponent = mount(
        <PluginEditor
          editorState={editorState}
          plugins={plugins}
          onChange={changeSpy}
        />
      );
      const draftEditorComponent = (pluginEditorComponent.find(Editor)).nodes[0];
      draftEditorComponent.focus();
      expect(spy.getCall(1).args[0]).to.deep.equal(draftEditorComponent);
    });
  });

  describe('passed proxy to DraftEditor', () => {
    let draftEditor;
    let pluginEditor;

    beforeEach(() => {
      const changeSpy = sinon.spy();
      const editorState = EditorState.createEmpty();
      const result = mount(
        <PluginEditor
          editorState={editorState}
          onChange={changeSpy}
          plugins={[]}
        />
      );
      draftEditor = result.node;
      pluginEditor = result.instance();
    });

    it('focus', () => {
      draftEditor.focus = sinon.spy();
      pluginEditor.focus();
      expect(draftEditor.focus).has.been.calledOnce();
    });

    it('blur', () => {
      draftEditor.blur = sinon.spy();
      pluginEditor.blur();
      expect(draftEditor.blur).has.been.calledOnce();
    });
  });

  describe('custom prop comes before plugin hook', () => {
    const changeSpy = sinon.spy();
    let editorState;
    let customHook;

    beforeEach(() => {
      editorState = EditorState.createEmpty();
      customHook = sinon.spy();
    });

    it('onUpArrow', () => {
      const plugin = {
        onUpArrow: sinon.spy(),
      };
      const result = mount(
        <PluginEditor
          editorState={editorState}
          onChange={changeSpy}
          plugins={[plugin]}
          onUpArrow={customHook}
        />
      );
      const draftEditor = result.node;
      draftEditor.props.onUpArrow();
      expect(plugin.onUpArrow).has.not.been.called();
      expect(customHook).has.been.calledOnce();
    });

    it('renders block component using blockRenderFn prop', () => {
      const plugin = {
        blockRendererFn: sinon.spy(),
      };
      const result = mount(
        <PluginEditor
          editorState={editorState}
          onChange={changeSpy}
          plugins={[plugin]}
          blockRendererFn={customHook}
        />
      );
      const draftEditor = result.node;
      draftEditor.props.blockRendererFn();
      expect(plugin.blockRendererFn).has.been.called();
      expect(customHook).has.been.called();
    });
  });

  describe('decorators prop', () => {
    let text;
    let decorator;
    let plugin;
    let plugins;
    let decorators;

    beforeEach(() => {
      text = "Hello there how's it going fella";

      decorator = {
        strategy: (block, cb) => cb(1, 3),
        component: () => <span className="decorator" />,
      };

      plugin = {
        decorators: [
          {
            strategy: (block, cb) => cb(4, 7),
            component: () => <span className="plugin" />,
          },
          {
            getDecorations: () => [],
            getComponentForKey: () => <span className="custom" />,
            getPropsForKey: () => {},
          },
        ],
      };

      plugins = [plugin];
      decorators = [decorator];
    });

    it('uses strategies from both decorators and plugins together', () => {
      const pluginStrategy = sinon.spy(plugin.decorators[0], 'strategy');
      const decoratorStrategy = sinon.spy(decorator, 'strategy');

      mount(<TestEditor {...{ plugins, decorators, text }} />);

      expect(decoratorStrategy).has.been.called();
      expect(pluginStrategy).has.been.called();
    });

    it('uses components from both decorators and plugins together', () => {
      const pluginComponent = sinon.spy(plugin.decorators[0], 'component');
      const decoratorComponent = sinon.spy(decorator, 'component');

      const wrapper = mount(<TestEditor {...{ plugins, decorators, text }} />);
      const decoratorComponents = wrapper.findWhere((n) => n.hasClass('decorator'));
      const pluginComponents = wrapper.findWhere((n) => n.hasClass('plugin'));

      expect(decoratorComponent).has.been.called();
      expect(pluginComponent).has.been.called();
      expect(decoratorComponents.length).to.equal(1);
      expect(pluginComponents.length).to.equal(1);
    });

    it('uses both custom and simple decorators in plugins', () => {
      const simplePluginDecoratorStrategy = sinon.spy(plugin.decorators[0], 'strategy');
      const customPluginDecorator = sinon.spy(plugin.decorators[1], 'getDecorations');
      const decoratorStrategy = sinon.spy(decorator, 'strategy');

      mount(<TestEditor {...{ plugins, decorators, text }} />);

      expect(simplePluginDecoratorStrategy).has.been.called();
      expect(customPluginDecorator).has.been.called();
      expect(decoratorStrategy).has.been.called();
    });
  });
});
