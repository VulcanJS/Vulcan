import React, { PropTypes, Component } from 'react';
import { ListContainer } from "meteor/utilities:react-list-container";

class PostsDay extends Component {

  render() {

    const {date, number} = this.props;

    const terms = {
      view: "top",
      date: date,
      after: moment(date).format("YYYY-MM-DD"),
      before: moment(date).format("YYYY-MM-DD"),
      enableCache: number <= 15 ? true : false, // only cache first 15 days
      listId: `posts.list.${moment(date).format("YYYY-MM-DD")}`
    };

    ({selector, options} = Posts.parameters.get(terms));

    return (
      <div className="posts-day">
        <h4 className="posts-day-heading">{moment(date).format("dddd, MMMM Do YYYY")}</h4>
        <ListContainer 
          collection={Posts} 
          publication="posts.list"
          selector={selector}
          options={options}
          terms={terms} 
          joins={Posts.getJoins()}
          component={Telescope.components.PostsList}
          componentProps={{showHeader: false}}
          listId={terms.listId}
        />
      </div>
    )

  }

}

PostsDay.propTypes = {
  date: React.PropTypes.object,
  number: React.PropTypes.number
}

module.exports = PostsDay;
export default PostsDay;