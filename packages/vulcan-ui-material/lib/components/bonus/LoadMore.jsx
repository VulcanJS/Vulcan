import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, intlShape } from 'react-intl';
import { Components, registerComponent } from 'meteor/vulcan:core';
import withStyles from '@material-ui/core/styles/withStyles';
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
  },
  
  textButton: {
    marginTop: theme.spacing.unit * 2,
  },
  
  iconButton: {},
  
  caption: {
    marginTop: theme.spacing.unit * 3,
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
  },
  
});


const LoadMore = ({
                    classes,
                    count,
                    totalCount,
                    loadMore,
                    networkStatus,
                    showCount,
                    useTextButton,
                    className,
                    infiniteScroll,
                  }, { intl }) => {
  
  const isLoadingMore = networkStatus < 7;
  const loadMoreText = intl.formatMessage({ id: 'load_more.load_more' });
  const title = `${loadMoreText} (${count}/${totalCount})`;
  const hasMore = totalCount > count;
  const countValues = { count, totalCount };
  
  const loadMoreButton = useTextButton
    ?
    <Button className={classes.textButton} onClick={() => loadMore()}>
      {title}
    </Button>
    :
    <IconButton className={classes.iconButton} onClick={() => loadMore()}>
      <ArrowDownIcon/>
    </IconButton>;
  
  return (
    <div className={classNames('load-more', classes.root, className)}>
      {
        showCount &&
        
        <Typography variant="caption" className={classes.caption}>
          <FormattedMessage id={`load_more.${hasMore ? 'loaded_count' : 'loaded_all'}`} values={countValues}/>
        </Typography>
      }
      {
        isLoadingMore
          
          ?
          
          <Components.Loading/>
          
          :
          
          hasMore
            
            ?
            
            infiniteScroll
              
              ?
              
              <ScrollTrigger onEnter={() => loadMore()}>
                {loadMoreButton}
              </ScrollTrigger>
              
              :
              
              loadMoreButton
            :
  
            null
      }
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
};


LoadMore.defaultProps = {
  showCount: true,
};


LoadMore.contextTypes = {
  intl: intlShape.isRequired,
};


LoadMore.displayName = 'LoadMore';


registerComponent('LoadMore', LoadMore, [withStyles, styles]);

