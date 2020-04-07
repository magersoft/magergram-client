import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import cx from 'classnames';
import style from './BottomNavigation.module.scss';
import { useTranslation } from 'react-i18next';
import { AddPostIcon, HomeIcon, LikeIcon, SearchPeopleIcon } from '../Icon';
import { Image } from '../UI';
import NoAvatarImg from '../../assets/noAvatar.jpg';

export default ({ user }) => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const [state, setState] = useState({});
  useEffect(() => {
    if (user) {
      setState(user);
    }
  }, [user]);

  return (
    <nav className={`${style.Navigation} bottom-navigation`}>
      <div className={style.iOS11fix} />
      <div className={style.Container}>
        <div className={cx(style.Button, style.Home)}>
          <Link to="/" title={t('Home')}>
            <HomeIcon width={24} height={24} color="var(--color-primary)" active={pathname === '/'} />
          </Link>
        </div>
        <div className={cx(style.Button, style.Explore)}>
          <Link to="/explore" title={t('Search')}>
            <SearchPeopleIcon width={24} height={24} color="var(--color-primary)" active={pathname === '/explore'} />
          </Link>
        </div>
        <div className={cx(style.Button, style.AddPost)}>
          <Link to="/add-post" title={t('Add Post')}>
            <AddPostIcon width={24} height={24} color="var(--color-primary)" />
          </Link>
        </div>
        <div className={cx(style.Button, style.Activity)}>
          <Link to="/activity" title={t('Activity')}>
            <LikeIcon width={24} height={24} color="var(--color-primary)" active={pathname === '/activity'} />
          </Link>
        </div>
        <div className={cx(style.Button, style.User)}>
          { state &&
          <Link to={`/${state.username}`} className={style.UserProfile}>
            <Image src={state.avatar || NoAvatarImg} alt="Avatar profile" />
          </Link>
          }
        </div>
      </div>
    </nav>
  )
};
