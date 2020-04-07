import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import cx from 'classnames';
import style from './BottomNavigation.module.scss';
import { useTranslation } from 'react-i18next';
import { AddPostIcon, HomeIcon, LikeIcon, SearchPeopleIcon } from '../Icon';
import { Image } from '../UI';
import NoAvatarImg from '../../assets/noAvatar.jpg';

export default ({ user, onActivity }) => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const [state, setState] = useState({
    user: null,
    isActivity: false
  });

  useEffect(() => {
    if (user) {
      setState(prevState => ({ ...prevState, user }));
    }
  }, [user]);

  const handleButtonClick = active => {
    setState({ ...state, isActivity: active });
    onActivity(active);
  };

  return (
    <nav className={`${style.Navigation} bottom-navigation`}>
      <div className={style.iOS11fix} />
      <div className={style.Container}>
        <div className={cx(style.Button, style.Home)} onClick={() => handleButtonClick(false)}>
          <Link to="/" title={t('Home')}>
            <HomeIcon width={24} height={24} color="var(--color-primary)" active={pathname === '/' && !state.isActivity} />
          </Link>
        </div>
        <div className={cx(style.Button, style.Explore)} onClick={() => handleButtonClick(false)}>
          <Link to="/explore" title={t('Search')}>
            <SearchPeopleIcon width={24} height={24} color="var(--color-primary)" active={pathname === '/explore' && !state.isActivity} />
          </Link>
        </div>
        <div className={cx(style.Button, style.AddPost)} onClick={() => handleButtonClick(false)}>
          <Link to="/add-post" title={t('Add Post')}>
            <AddPostIcon width={24} height={24} color="var(--color-primary)" />
          </Link>
        </div>
        <div className={cx(style.Button, style.Activity)}>
          <button onClick={() => handleButtonClick(true)}>
            <LikeIcon width={24} height={24} color="var(--color-primary)" active={state.isActivity} />
          </button>
        </div>
        <div className={cx(style.Button, style.User)} onClick={() => handleButtonClick(false)}>
          { state.user &&
          <Link to={`/${state.user.username}`} className={style.UserProfile}>
            <Image src={state.user.avatar || NoAvatarImg} alt="Avatar profile" />
          </Link>
          }
        </div>
      </div>
    </nav>
  )
};
