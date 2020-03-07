import React, { useEffect, useRef, useState } from 'react';
import Helmet from 'react-helmet';
import style from './Feed.module.scss';
import StoriesList from '../../components/StoriesList';
import Sidebar from '../../components/Sidebar/Sidebar';

const RESIZE_BREAKPOINT = 1000;
const RIGHT_POSITION = 28;

export default () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [leftFixedPosition, setLeftFixedPosition] = useState(null);
  const feedRef = useRef();

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
        <div>
          Posts
        </div>
      </div>
      { showSidebar && <Sidebar leftFixedPosition={leftFixedPosition} /> }
    </section>
  )
};
