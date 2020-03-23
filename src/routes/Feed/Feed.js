import React, { useEffect, useRef, useState } from 'react';
import Helmet from 'react-helmet';
import StoriesList from '../../components/StoriesList';
import Sidebar from '../../components/Sidebar/Sidebar';
import { useQuery } from '@apollo/react-hooks';
import { FEED_QUERY } from './FeedQueries';
import { Post, PostSkeleton } from '../../components/Post';
import style from './Feed.module.scss';
import RecommendForYou from '../../components/RecommendForYou';

const RESIZE_BREAKPOINT = 1000;
const RIGHT_POSITION = 28;

export default () => {
  const [feed, setFeed] = useState([]);
  const [afterQuery, setAfterQuery] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showContainer, setShowContainer] = useState(true);
  const [leftFixedPosition, setLeftFixedPosition] = useState(null);
  const feedRef = useRef();

  const { data, loading } = useQuery(FEED_QUERY, { fetchPolicy: 'network-only' });

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

  return (
    <React.Fragment>
      <Helmet>
        <title>Magergram</title>
      </Helmet>
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
                  feed.map(post => {
                    const { id, location, caption, likeCount, isLiked, commentCount, files, user, lastComments, createdAt } = post;
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
                        createdAt={createdAt}
                      />
                    )
                  })
                }
              </div>
            </div>
            {  (!afterQuery || !!feed.length ) && showSidebar && <Sidebar leftFixedPosition={leftFixedPosition} isFeedGetted={feed.length} /> }
          </section>
        }
    </React.Fragment>
  )
};
