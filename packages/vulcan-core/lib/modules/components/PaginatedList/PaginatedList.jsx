import { Components, registerComponent } from 'meteor/vulcan:lib';
import React from 'react';
import withComponents from '../../containers/withComponents';
import { useMulti2 } from '../../containers/multi2';

export const PaginatedList = ({ className, options, Components }) => {
  const useMultiResults = useMulti2(options);

  const {
    results = [],
    loadingInitial,
    loadingMore,
    count,
    totalCount,
    showLoadMore = true,
    networkError,
    graphQLErrors,
  } = useMultiResults;

  // error handling
  let errors = [];
  if (networkError) {
    errors = [networkError];
  }
  if (graphQLErrors) {
    errors = [...errors, ...graphQLErrors];
  }

  const props = {
    className,
    options,
    Components,
    errors,
    ...useMultiResults,
  };

  // console.log(Components)

  return (
    <Components.PaginatedListLayout {...props}>
      {errors.length > 0 ? (
        <Components.PaginatedListErrors {...props} />
      ) : loadingInitial ? (
        <Components.PaginatedListLoadingInitial {...props} />
      ) : (
        <Components.PaginatedListContentLayout>
          {results.length ? <Components.PaginatedListResults {...props} /> : <Components.PaginatedListNoResults {...props} />}
          {totalCount > count &&
            (loadingMore ? (
              <Components.PaginatedListLoadingMore {...props} />
            ) : (
              showLoadMore && <Components.PaginatedListLoadMore {...props} />
            ))}
        </Components.PaginatedListContentLayout>
      )}
    </Components.PaginatedListLayout>
  );
};

registerComponent({ name: 'PaginatedList', component: PaginatedList, hocs: [withComponents] });

const PaginatedListLayout = ({ className, children }) => <div className={`${className} list-container`}>{children}</div>;

registerComponent('PaginatedListLayout', PaginatedListLayout);

const PaginatedListContentLayout = ({ children }) => <div className="list-contents">{children}</div>;

registerComponent('PaginatedListContentLayout', PaginatedListContentLayout);

const PaginatedListErrors = ({ Components, errors }) => (
  <div className="list-errors">
    {errors.map(error => (
      <Components.PaginatedListError key={error.message} Components={Components} error={error} />
    ))}
  </div>
);
registerComponent('PaginatedListErrors', PaginatedListErrors);

const PaginatedListError = ({ Components, error }) => <Components.Alert variant="danger">{error.message}</Components.Alert>;

registerComponent('PaginatedListError', PaginatedListError);

const PaginatedListLoadingInitial = ({ Components }) => <Components.Loading />;

registerComponent('PaginatedListLoadingInitial', PaginatedListLoadingInitial);

const PaginatedListResults = ({ Components, results }) => (
  <div className="list-results">
    {results.map(
      (document, i) => document && <Components.PaginatedListItem Components={Components} key={document._id || i} document={document} />
    )}
  </div>
);

registerComponent('PaginatedListResults', PaginatedListResults);

const PaginatedListItem = ({ Components, document }) => <Components.Card document={document} />;

registerComponent('PaginatedListItem', PaginatedListItem);

const PaginatedListNoResults = () => (
  <p className="list-noresults">
    <Components.FormattedMessage id="paginatedlist.no_results" />
  </p>
);

registerComponent('PaginatedListNoResults', PaginatedListNoResults);

const PaginatedListLoadingMore = ({ Components }) => <Components.Loading />;

registerComponent('PaginatedListLoadingMore', PaginatedListLoadingMore);

const PaginatedListLoadMore = ({ Components, loadMore, count, totalCount }) => (
  <Components.Button
    className="list-loadmore"
    onClick={e => {
      e.preventDefault();
      loadMore();
    }}>
    <Components.FormattedMessage id="paginatedlist.load_more" defaultMessage="Load More" />
    &nbsp;{' '}
    <span className="list-loadedcount">
      ({count}/{totalCount})
    </span>
  </Components.Button>
);

registerComponent('PaginatedListLoadMore', PaginatedListLoadMore);

export default PaginatedList;
