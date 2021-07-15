import React from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'meteor/vulcan:i18n';
import { Components, registerComponent } from 'meteor/vulcan:core';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ArrowDownIcon from 'mdi-material-ui/ArrowDown';
import ScrollTrigger from './ScrollTrigger';
import classNames from 'classnames';

const styles = theme => ({
  root: {
    textAlign: 'center',
    flexBasis: '100%',
    marginTop: theme.spacing(3),
  },

  textButton: {
    marginTop: theme.spacing(2),
  },

  iconButton: {},

  caption: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
});

const LoadMore = (
  {
    classes,
    count,
    totalCount,
    loadMore,
    networkStatus,
    showCount,
    useTextButton,
    className,
    infiniteScroll,
    scroller,
  },
  { intl }
) => {
  const isLoadingMore = networkStatus < 7;
  const loadMoreText = intl.formatMessage({ id: 'load_more.load_more' });
  const title = `${loadMoreText} (${count}/${totalCount})`;
  const hasMore = totalCount > count;
  const countValues = { count, totalCount };
  const loadMoreId = hasMore
    ? 'loaded_count'
    : !totalCount
    ? 'no_items'
    : totalCount === 1
    ? 'one_item'
    : 'total_items';
  showCount = isNaN(totalCount) || isNaN(count) ? false : showCount;

  const loadMoreButton = useTextButton ? (
    <Button className={classes.textButton} onClick={() => loadMore()}>
      {title}
    </Button>
  ) : (
    <IconButton className={classes.iconButton} onClick={() => loadMore()}>
      <ArrowDownIcon />
    </IconButton>
  );

  return (
    <div className={classNames('load-more', classes.root, className)}>
      {showCount && (
        <Typography variant="caption" className={classes.caption}>
          <Components.FormattedMessage id={`load_more.${loadMoreId}`} values={countValues} />
        </Typography>
      )}
      {isLoadingMore ? (
        <Components.Loading />
      ) : hasMore ? (
        infiniteScroll ? (
          <ScrollTrigger scroller={scroller} onTrigger={() => loadMore()}>
            {loadMoreButton}
          </ScrollTrigger>
        ) : (
          loadMoreButton
        )
      ) : null}
    </div>
  );
};

LoadMore.propTypes = {
  classes: PropTypes.object.isRequired,
  count: PropTypes.number,
  totalCount: PropTypes.number,
  loadMore: PropTypes.func,
  networkStatus: PropTypes.number,
  showCount: PropTypes.bool,
  useTextButton: PropTypes.bool,
  className: PropTypes.string,
  infiniteScroll: PropTypes.bool,
  scroller: PropTypes.object,
};

LoadMore.defaultProps = {
  showCount: true,
};

LoadMore.contextTypes = {
  intl: intlShape.isRequired,
};

LoadMore.displayName = 'LoadMore';

registerComponent('LoadMore', LoadMore, [withStyles, styles]);
