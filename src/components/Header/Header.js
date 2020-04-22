import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import LogoImg from '../../assets/logo.png';
import LogoImgX2 from '../../assets/logo-x2.png';
import DarkLogoImg from '../../assets/dark-logo.png'
import DarkLogoImgX2 from '../../assets/dark-logo-x2.png'
import NoAvatarImg from '../../assets/noAvatar.jpg';
import { Image, Search } from '../UI';
import { HomeIcon, LikeIcon, SearchPeopleIcon } from '../Icon';
import style from './Header.module.scss';
import Activity from '../Activity';
import cx from 'classnames';

export default ({ user, darkMode }) => {
  const [state, setState] = useState({
    newNotificationsCount: 0,
    showActivity: false
  });

  const { pathname } = useLocation();

  useEffect(() => {
    if (user) {
      setState(prevState => ({ ...prevState, newNotificationsCount: user.newNotificationsCount }));
    }
  }, [user]);

  const handleActivityClick = () => {
    setState(prevState => ({
      ...prevState,
      newNotificationsCount: 0,
      showActivity: !state.showActivity
    }))
  }

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
                  <button className={style.ActivityButton} onClick={handleActivityClick}>
                    { user && state.newNotificationsCount !== 0 ?
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
                { user &&
                <div className={style.NavigationIcon}>
                  <Link to={`/${user.username}`} className={style.UserProfile}>
                    <Image src={user.avatar || NoAvatarImg} alt="Avatar profile" />
                  </Link>
                </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
