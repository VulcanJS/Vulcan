class NewPost extends React.Component {
  render() {
    return (
      <div>
        <h1>Create a post</h1>
        <MRF.Form
          collection={Posts}
          type="insert"
          ref="form"
          onSuccess={(docId) => FlowRouter.go('posts.update', { postId: docId })}
          />
        <RaisedButton label="Create" onTouchTap={() => this.refs.form.submit()}/>
      </div>
    );
  },
};