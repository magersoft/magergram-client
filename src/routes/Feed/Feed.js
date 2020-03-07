import React, { useEffect, useRef, useState } from 'react';
import Helmet from 'react-helmet';
import style from './Feed.module.scss';
import StoriesList from '../../components/StoriesList';
import Sidebar from '../../components/Sidebar/Sidebar';
import { useMutation } from '@apollo/react-hooks';
import { REMOVE_LOADING, SET_LOADING } from '../../apollo/GlobalQueries';

const RESIZE_BREAKPOINT = 1000;
const RIGHT_POSITION = 28;

export default () => {
  const [loading, setLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [leftFixedPosition, setLeftFixedPosition] = useState(null);
  const feedRef = useRef();

  const [setGlobalLoading] = useMutation(SET_LOADING);
  const [removeGlobalLoading] = useMutation(REMOVE_LOADING);

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

  useEffect(() => {
    setGlobalLoading();
    setLoading(true);
  }, [loading]);

  useEffect(() => {
    const timer = setTimeout(() => {
      removeGlobalLoading();
      console.log('remove loading');
    }, 500);
    return () => clearTimeout(timer);
  }, []);

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
