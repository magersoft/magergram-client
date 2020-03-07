import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LogoImg from '../../assets/logo.png';
import NoAvatarImg from '../../assets/noAvatar.jpg';
import { Search } from '../UI';
import { HomeIcon, LikeIcon, SearchPeopleIcon } from '../Icon';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { MY_PROFILE } from './HeaderQueries';
import style from './Header.module.scss';
import { REMOVE_LOADING, SET_LOADING } from '../../apollo/GlobalQueries';

export default () => {
  const [state, setState] = useState({
    username: '',
    avatar: null
  });

  const [setGlobalLoading] = useMutation(SET_LOADING);
  const [removeGlobalLoading] = useMutation(REMOVE_LOADING);

  const { loading, data } = useQuery(MY_PROFILE, {
    onCompleted: data => {
      const { myProfile } = data;
      if (myProfile) {
        const { username, avatar } = myProfile;
        setState({ ...state, username, avatar })
      }
    }
  });

  useEffect(() => {
    if (loading) {
      setGlobalLoading();
    }
    if (!loading && data) {
      removeGlobalLoading();
    }
  }, [loading]);

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
                    <img src={LogoImg} alt="Magergram" />
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
                    <HomeIcon color="var(--blackColor)" width="22" height="22" />
                  </Link>
                </div>
                <div className={style.NavigationIcon}>
                  <Link to="/explore">
                    <SearchPeopleIcon color="var(--blackColor)" width="22" height="22" />
                  </Link>
                </div>
                <div className={style.NavigationIcon}>
                  <Link to="/">
                    <LikeIcon color="var(--blackColor)" width="22" height="22" />
                  </Link>
                </div>
                <div className={style.NavigationIcon}>
                  <Link to={state.username} className={style.UserProfile}>
                    <img src={state.avatar ? state.avatar : NoAvatarImg} alt="Avatar profile"/>
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
