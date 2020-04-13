import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { gql } from 'apollo-boost';
import LogoImg from '../../assets/logo.png';
import LogoImgX2 from '../../assets/logo-x2.png';
import DarkLogoImg from '../../assets/dark-logo.png'
import DarkLogoImgX2 from '../../assets/dark-logo-x2.png'
import NoAvatarImg from '../../assets/noAvatar.jpg';
import { Image, Search } from '../UI';
import { HomeIcon, LikeIcon, SearchPeopleIcon } from '../Icon';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { MY_PROFILE } from './HeaderQueries';
import { REMOVE_LOADING, SET_LANGUAGE, SET_LOADING, TOGGLE_DARK_MODE_CLIENT } from '../../apollo/GlobalQueries';
import style from './Header.module.scss';
import Activity from '../Activity';
import cx from 'classnames';

const DARK_MODE = gql`
  {
    darkMode @client
  }
`;

export default ({ setUser, activity }) => {
  const [state, setState] = useState({
    username: '',
    newNotificationsCount: null,
    avatar: null,
    showActivity: false
  });
  const { pathname } = useLocation();

  const [setGlobalLoading] = useMutation(SET_LOADING);
  const [removeGlobalLoading] = useMutation(REMOVE_LOADING);
  const [setDarkMode] = useMutation(TOGGLE_DARK_MODE_CLIENT);
  const [setLanguage] = useMutation(SET_LANGUAGE);

  const { loading, data } = useQuery(MY_PROFILE);

  useEffect(() => {
    if (data) {
      const { myProfile } = data;
      if (myProfile) {
        const { username, avatar, darkMode, language, newNotificationsCount } = myProfile;
        setState({ username, avatar, newNotificationsCount });
        setDarkMode({ variables: { darkMode } });
        setLanguage({ variables: { lang: language } });
        setUser(myProfile);
      }
    }
  }, [data, setDarkMode, setLanguage, setUser]);

  useEffect(() => {
    if (loading) {
      setGlobalLoading();
    }
    if (!loading && data) {
      removeGlobalLoading();
    }
  }, [loading, data, setGlobalLoading, removeGlobalLoading]);

  useEffect(() => {
    setState(prevState => ({ ...prevState, showActivity: activity }));
  }, [activity]);

  const { data: { darkMode } } = useQuery(DARK_MODE);

  return (
    <nav className={style.Header}>
      <div className={style.Wrapper} />
      <div className={style.Inner}>
        <div className={style.Container}>
          <div className={style.Grid}>
            <div className={style.Logo}>
              <Link to="/">
                <div className={style.LogoContainer}>
                  <div className={style.LogoImg}>
                    <img src={darkMode ? DarkLogoImg : LogoImg} srcSet={darkMode ? DarkLogoImgX2 : LogoImgX2} alt="Magergram" />
                  </div>
                </div>
              </Link>
            </div>
            <div className={style.Search}>
              <Search />
            </div>
            <div className={style.Navigation}>
              <div className={style.NavigationContainer}>
                <div className={style.NavigationIcon}>
                  <Link to="/">
                    <HomeIcon
                      color="var(--color-main)"
                      width="22"
                      height="22"
                      active={pathname === '/'}
                    />
                  </Link>
                </div>
                <div className={style.NavigationIcon}>
                  <Link to="/explore">
                    <SearchPeopleIcon
                      color="var(--color-main)"
                      width="22"
                      height="22"
                      active={pathname === '/explore'}
                    />
                  </Link>
                </div>
                <div className={cx(style.NavigationIcon, style.showActivityIcon)}>
                  <button className={style.ActivityButton} onClick={() => setState({ ...state, showActivity: !state.showActivity, newNotificationsCount: 0 })}>
                    { state.newNotificationsCount && state.newNotificationsCount !== 0 ?
                    <div className={style.NewNotificationsCount}>
                      <span>{ state.newNotificationsCount }</span>
                    </div> : null
                    }
                    <LikeIcon
                      color="var(--color-main)"
                      width="22"
                      height="22"
                      active={state.showActivity}
                    />
                  </button>
                  { state.showActivity && <Activity show={state.showActivity} onClose={() => setState({...state, showActivity: false})}/> }
                </div>
                <div className={style.NavigationIcon}>
                  <Link to={`/${state.username}`} className={style.UserProfile}>
                    <Image src={state.avatar || NoAvatarImg} alt="Avatar profile" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
