import React, { useEffect, useRef, useState } from 'react';
import Helmet from 'react-helmet';
import StoriesList from '../../components/StoriesList';
import Sidebar from '../../components/Sidebar/Sidebar';
import { useQuery } from '@apollo/react-hooks';
import { FEED_QUERY } from './FeedQueries';
import { Post, PostSkeleton } from '../../components/Post';
import style from './Feed.module.scss';

const RESIZE_BREAKPOINT = 1000;
const RIGHT_POSITION = 28;

export default () => {
  const [feed, setFeed] = useState([]);
  const [showSidebar, setShowSidebar] = useState(true);
  const [leftFixedPosition, setLeftFixedPosition] = useState(null);
  const feedRef = useRef();

  const { data, loading } = useQuery(FEED_QUERY, { fetchPolicy: 'network-only' });

  useEffect(() => {
    if (data) {
      const { seeFeed } = data;
      setFeed(seeFeed);
    }
  }, [data]);

  useEffect(() => {
    function handleResizeWindow(event) {
      const innerWidth = event.target.innerWidth;

      if (innerWidth < RESIZE_BREAKPOINT) {
        setShowSidebar(false);
      } else {
        setShowSidebar(true);
      }

      setLeftFixedPosition(feedRef.current.getBoundingClientRect().right + RIGHT_POSITION);
    }

    setLeftFixedPosition(feedRef.current.getBoundingClientRect().right + RIGHT_POSITION);

    window.addEventListener('resize', handleResizeWindow);

    return function cleanup() {
      window.removeEventListener('resize', handleResizeWindow);
    }
  }, [leftFixedPosition]);

  return (
    <section className={`${style.Container} ${showSidebar ? style.fullWidth : ''}`}>
      <Helmet>
        <title>Magergram</title>
      </Helmet>
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
      { showSidebar && <Sidebar leftFixedPosition={leftFixedPosition} /> }
    </section>
  )
};
