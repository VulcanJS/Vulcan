import React, { PropTypes, Component } from 'react';
import { Components, registerComponent, withCurrentUser } from 'meteor/vulcan:core';
import Editor, { Editable, createEmptyState } from 'ory-editor-core';
import { Trash, DisplayModeToggle, Toolbar } from 'ory-editor-ui'
import withEditor from './withEditor.jsx'

const placeholderContent = {
    id: '2',
    cells: [{
      rows: [
        {
          cells: [
            {
              content: {
                plugin: {
                  name: 'ory/editor/core/content/slate'
                },
                state: {}
              },
              id: '7d29c96e-53b8-4b3e-b0f1-758b405d6daf'
            }
          ],
          id: 'd62fe894-5795-4f00-80c8-0a5c9cfe85b9'
        },
        {
          cells: [
            {
              rows: [
                {
                  cells: [
                    {
                      content: {
                        plugin: {
                          name: 'ory/editor/core/content/slate'
                        },
                        state: {
                          importFromHtml: '<p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>'
                        }
                      },
                      id: '254233b6-4bf3-4d0a-8c86-ab7b88f4283c'
                    }
                  ],
                  id: 'f32b324e-2d17-4658-8941-93c7380d51d8'
                },
                {
                  cells: [
                    {
                      content: {
                        plugin: {
                          name: 'ory/editor/core/content/slate'
                        },
                        state: {
                          importFromHtml: '<p>Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.</p>'
                        }
                      },
                      id: 'c5d411d5-595c-4ff2-ac11-0d0079a814ef'
                    }
                  ],
                  id: '25d9f081-28b6-45f0-bff0-5a11bc5db071'
                },
                {
                  cells: [
                    {
                      content: {
                        plugin: {
                          name: 'ory/editor/core/content/slate'
                        },
                        state: {
                          importFromHtml: '<p>Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.</p>'
                        }
                      },
                      id: '42cd103b-9b14-4674-a895-50c629183a00'
                    }
                  ],
                  id: 'c969431c-aa25-4b81-a5e5-752751517309'
                },
                {
                  cells: [
                    {
                      content: {
                        plugin: {
                          name: 'ory/editor/core/content/slate'
                        },
                        state: {
                          importFromHtml: '<p>Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.</p>'
                        }
                      },
                      id: '15ab9e7d-70e2-4a6b-9f99-3a849a31ac59'
                    }
                  ],
                  id: '83c94e3c-2fd5-4e2a-8384-4f31841dab27'
                }
              ],
              id: '9a7d26ec-ead5-429f-a596-b53935642f4b'
            }
          ],
          id: '8c16dbe4-96e3-41fd-8012-6c37233d86f6'
        }
      ],
      id: '15efd3c3-b683-4da6-b107-16d8d0c8cd26'
    }]
  };


class CommentEditor extends Component {
  constructor(props) {
    super(props);
    const editor = this.props.editor;
    editor.trigger.editable.add(placeholderContent); //TODO: Replace placeholderContent with document.content when done with debugging
  }

  render() {
    const document = this.props.document;
    const addValues = this.context.addToAutofilledValues;
    const editor = this.props.editor;

    const onChange = function(data) {
      addValues({draftJS: data});
      return data;
    };

    return (
      <div className="commentEditor">
        <Editable editor={editor} id={placeholderContent.id} onChange={onChange} />
        <Toolbar editor={editor} />
      </div>
    );
  }
}

CommentEditor.contextTypes = {
  addToAutofilledValues: React.PropTypes.func,
}

registerComponent('CommentEditor', withEditor(CommentEditor), withCurrentUser);

export default withEditor(CommentEditor);
