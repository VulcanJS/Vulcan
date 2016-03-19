const LoadMore = ({loadMore, count, totalCount}) => <a href="#" className="load-more button button--primary" onClick={loadMore}>Load More ({count}/{totalCount})</a>

module.exports = LoadMore;