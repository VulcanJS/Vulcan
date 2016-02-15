const LoadMore = props => <a href="#" className="load-more" onClick={props.loadMore}>Load More ({props.count}/{props.totalCount})</a>

module.exports = LoadMore;