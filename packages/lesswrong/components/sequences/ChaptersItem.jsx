import React, { PropTypes, Component } from 'react';
import { registerComponent, ModalTrigger, Components } from 'meteor/vulcan:core';
import Users from 'meteor/vulcan:users';

class ChaptersItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      edit: false,
    }
  }

  showEdit = () => {
    this.setState({edit: true})
  }

  showChapter = () => {
    this.setState({edit: false})
  }

  renderTitleComponent = (chapter, canEdit) => <div>
    {chapter.subtitle ?   <div className="chapters-item-subtitle">
        {chapter.subtitle}
      </div> : null}
    {canEdit ? <a onTouchTap={this.showEdit}>edit</a> : null}
  </div>

  render() {
    const chapter = this.props.chapter;
    if (this.state.edit) {
      return <Components.ChaptersEditForm
                documentId={chapter._id}
                successCallback={this.showChapter}
                cancelCallback={this.showChapter} />
    } else {
      return <div className="chapters-item">
        <Components.Section title={chapter.title}
          titleComponent={this.renderTitleComponent(chapter, this.props.canEdit)}
        >
          {chapter.description ? <div className="chapters-item-description">
              {chapter.description ? <Components.ContentRenderer state={chapter.description} /> : null}
            </div> : null}

          <div className="chapters-item-posts">
            <Components.SequencesPostsList posts={chapter.posts} />
          </div>
        </Components.Section>
      </div>
    }
  }
}

registerComponent('ChaptersItem', ChaptersItem)
