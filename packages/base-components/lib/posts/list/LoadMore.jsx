const LoadMore = ({loadMore, count, totalCount}) => <a href="#" className="post-load-more" onClick={loadMore}>Load More ({count}/{totalCount})</a>

module.exports = LoadMore;