import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { gql } from 'apollo-boost';
import LogoImg from '../../assets/logo.png';
import LogoImgX2 from '../../assets/logo-x2.png';
import DarkLogoImg from '../../assets/dark-logo.png'
import DarkLogoImgX2 from '../../assets/dark-logo-x2.png'
import NoAvatarImg from '../../assets/noAvatar.jpg';
import { Image, Search } from '../UI';
import { DirectIcon, HomeIcon, LikeIcon, SearchPeopleIcon } from '../Icon';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { MY_PROFILE } from './HeaderQueries';
import { REMOVE_LOADING, SET_LANGUAGE, SET_LOADING, TOGGLE_DARK_MODE_CLIENT } from '../../apollo/GlobalQueries';
import style from './Header.module.scss';
import NewStoryIcon from '../Icon/NewStoryIcon';

const DARK_MODE = gql`
  {
    darkMode @client
  }
`;

export default ({ setUser }) => {
  const [state, setState] = useState({
    username: '',
    avatar: null
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
        const { username, avatar, darkMode, language } = myProfile;
        setState({ username, avatar });
        setDarkMode({ variables: { darkMode } });
        setLanguage({ variables: { lang: language } });
        setUser(myProfile);
      }
    }
  }, [data, setDarkMode, setLanguage]);

  useEffect(() => {
    if (loading) {
      setGlobalLoading();
    }
    if (!loading && data) {
      removeGlobalLoading();
    }
  }, [loading, data, setGlobalLoading, removeGlobalLoading]);

  const { data: { darkMode } } = useQuery(DARK_MODE);

  return (
    <nav className={style.Header}>
      <div className={style.Wrapper} />
      <div className={style.Inner}>
        <div className={style.Container}>
          <div className={style.Grid}>
            <div className={style.SetStories}>
              <button className={style.IconButton} onClick={() => alert('Coming soon ...')}>
                <NewStoryIcon width={24} height={24} color="var(--color-primary)" />
              </button>
            </div>
            <div className={style.Logo}>
              <Link to="/">
                <div className={style.LogoContainer}>
                  <div className={style.LogoImg}>
                    <img src={darkMode ? DarkLogoImg : LogoImg} srcSet={darkMode ? DarkLogoImgX2 : LogoImgX2} alt="Magergram" />
                  </div>
                </div>
              </Link>
            </div>
            <div className={style.Direct}>
              <button className={style.IconButton} onClick={() => alert('Coming soon ...')}>
                <DirectIcon width={24} height={24} color="var(--color-primary)" />
              </button>
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
                <div className={style.NavigationIcon}>
                  <Link to="/">
                    <LikeIcon
                      color="var(--color-main)"
                      width="22"
                      height="22"
                      active={pathname === '/activity'}
                    />
                  </Link>
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
