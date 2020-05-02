import React, { useEffect, useRef, useState } from 'react';
import Helmet from 'react-helmet';
import StoriesList from '../../components/StoriesList';
import Sidebar from '../../components/Sidebar/Sidebar';
import { useQuery } from '@apollo/react-hooks';
import { FEED_QUERY } from './FeedQueries';
import { Post, PostSkeleton } from '../../components/Post';
import style from './Feed.module.scss';
import RecommendForYou from '../../components/RecommendForYou';
import Spinner from '../../components/Loader/Spinner';
import InfiniteScroll from 'react-infinite-scroller';
import AppHeader from '../../components/AppHeader';
import NewStoryIcon from '../../components/Icon/NewStoryIcon';
import { DirectIcon } from '../../components/Icon';
import { Link } from 'react-router-dom';

const RESIZE_BREAKPOINT = 1000;
const RIGHT_POSITION = 28;
const PER_PAGE_POST = 3;

export default () => {
  const [feed, setFeed] = useState([]);
  const [afterQuery, setAfterQuery] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showContainer, setShowContainer] = useState(true);
  const [leftFixedPosition, setLeftFixedPosition] = useState(null);
  const [noMoreFeed, setNoMoreFeed] = useState(false);
  const feedRef = useRef();

  const { data, loading, fetchMore } = useQuery(FEED_QUERY, {
    variables: {
      perPage: PER_PAGE_POST,
      page: 0
    },
    fetchPolicy: 'cache-and-network'
  });

  useEffect(() => {
    if (data) {
      const { seeFeed } = data;
      setFeed(seeFeed);
      setAfterQuery(true);
    }
  }, [data]);

  useEffect(() => {
    const feedContainer = feedRef.current;
    function handleResizeWindow(event) {
      const innerWidth = event.target.innerWidth;

      if (innerWidth < RESIZE_BREAKPOINT) {
        setShowSidebar(false);
      } else {
        setShowSidebar(true);
      }

      setLeftFixedPosition(feedContainer.getBoundingClientRect().right + RIGHT_POSITION);
    }

    if (feedContainer) {
      setLeftFixedPosition(feedContainer.getBoundingClientRect().right + RIGHT_POSITION);
    }

    if (feedContainer) {
      window.addEventListener('resize', handleResizeWindow);
    }

    return function cleanup() {
      if (feedContainer) {
        window.removeEventListener('resize', handleResizeWindow);
      }
    }
  }, [leftFixedPosition]);

  const handleChangeContainer = () => {
    setShowContainer(false);
  };

  const handleFetchMore = async page => {
    try {
      await fetchMore({
        variables: {
          perPage: PER_PAGE_POST,
          page
        },
        updateQuery: (prevResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) {
            return prevResult;
          }
          if (!fetchMoreResult.seeFeed.length) {
            setNoMoreFeed(true);
          }
          return {
            ...prevResult,
            seeFeed: [ ...prevResult.seeFeed, ...fetchMoreResult.seeFeed ]
          };
        }
      })
    } catch {}
  };

  return (
    <React.Fragment>
      <Helmet>
        <title>Magergram</title>
      </Helmet>
      <AppHeader
        leftButton={
          <button onClick={() => alert('Coming soon ...')}>
            <NewStoryIcon width={24} height={24} color="var(--color-main)" />
          </button>
        }
        rightButton={
          <React.Fragment>
            <Link to="/direct/inbox">
              <DirectIcon width={24} height={24} color="var(--color-main)" />
            </Link>
          </React.Fragment>
        }
        withNotification={!!feed.length}
      />
      { afterQuery && <RecommendForYou isExistPosts={feed.length} onLoading={handleChangeContainer} /> }
      { showContainer &&
        <section className={`${style.Container} ${showSidebar ? style.fullWidth : ''}`}>
          <div ref={feedRef} className={showSidebar ? style.Feed : ''}>
            <StoriesList />
            <div className={style.Posts}>
              { !data && loading ?
                <React.Fragment>
                  <PostSkeleton />
                  <PostSkeleton />
                </React.Fragment>
                :
                <InfiniteScroll
                  pageStart={0}
                  loadMore={handleFetchMore}
                  hasMore={!noMoreFeed}
                  initialLoad={false}
                  loader={
                    <div key={0} className={style.MoreLoading}>
                      { feed.length ? <Spinner width={50} height={50} /> : null }
                    </div>
                  }
                >
                  { feed.map(post => {
                    const { id, location, caption, likeCount, isLiked, isFavorite, commentCount, files, user, lastComments, createdAt } = post;
                    return (
                      !!files.length &&
                      <Post
                        key={id}
                        postId={id}
                        user={user}
                        location={location}
                        caption={caption}
                        files={files}
                        comments={lastComments}
                        commentCount={commentCount}
                        likeCount={likeCount}
                        isLiked={isLiked}
                        isFavorite={isFavorite}
                        createdAt={createdAt}
                      />
                    )
                  }) }
                </InfiniteScroll>
              }
            </div>
            { loading && !feed.length ?
              <div className={style.MoreLoading}>
                <Spinner width={50} height={50} />
              </div> : null
            }
          </div>
          {  (!afterQuery || !!feed.length ) && showSidebar && <Sidebar leftFixedPosition={leftFixedPosition} isFeedGetted={feed.length} /> }
        </section>
      }
    </React.Fragment>
  )
};
