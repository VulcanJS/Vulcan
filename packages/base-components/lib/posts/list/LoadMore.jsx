const LoadMore = ({loadMore, count, totalCount}) => {
  const label = totalCount ? `Load More (${count}/${totalCount})` : "Load More";
  return <a className="post-load-more" onClick={loadMore}>{label}</a>
}

module.exports = LoadMore;