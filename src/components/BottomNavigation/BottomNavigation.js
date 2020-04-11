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
  const [state, setState] = useState({
    user: null
  });

  useEffect(() => {
    if (user) {
      setState(prevState => ({ ...prevState, user }));
    }
  }, [user]);

  return (
    <nav className={`${style.Navigation} bottom-navigation`}>
      <div className={style.iOS11fix} />
      <div className={style.Container}>
        <div className={cx(style.Button, style.Home)}>
          <Link to="/" className={style.Link} title={t('Home')}>
            <HomeIcon width={24} height={24} color="var(--color-main)" active={pathname === '/'} />
          </Link>
        </div>
        <div className={cx(style.Button, style.Explore)}>
          <Link to="/explore" className={style.Link} title={t('Explore')}>
            <SearchPeopleIcon width={24} height={24} color="var(--color-main)" active={pathname === '/explore'} />
          </Link>
        </div>
        <div className={cx(style.Button, style.AddPost)}>
          <Link to="/add-post" className={style.Link} title={t('Add Post')}>
            <AddPostIcon width={24} height={24} color="var(--color-main)" />
          </Link>
        </div>
        <div className={cx(style.Button, style.Activity)}>
          <Link to="/activity" className={style.Link} title={t('Activity')}>
            <LikeIcon width={24} height={24} color="var(--color-main)" active={pathname === '/activity'} />
          </Link>
        </div>
        <div className={cx(style.Button, style.User)}>
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
