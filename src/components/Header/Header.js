import React from 'react';
import { Link } from 'react-router-dom';
import LogoImg from '../../assets/logo.png';
import NoAvatarImg from '../../assets/noAvatar.jpg';
import { useTranslation } from 'react-i18next';
import { HomeIcon, LikeIcon, SearchPeopleIcon } from '../Icon';
import style from './Header.module.scss';

export default () => {
  const { t } = useTranslation();

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
              <input type="text" autoCapitalize="none" placeholder={t('Search')} />
            </div>
            <div className={style.Navigation}>
              <div className={style.NavigationContainer}>
                <div className={style.NavigationIcon}>
                  <Link to="/">
                    <HomeIcon color="var(--blackColor)" width="22" height="22" />
                  </Link>
                </div>
                <div className={style.NavigationIcon}>
                  <Link to="/">
                    <SearchPeopleIcon color="var(--blackColor)" width="22" height="22" />
                  </Link>
                </div>
                <div className={style.NavigationIcon}>
                  <Link to="/">
                    <LikeIcon color="var(--blackColor)" width="22" height="22" />
                  </Link>
                </div>
                <div className={style.NavigationIcon}>
                  <Link to="/" className={style.UserProfile}>
                    <img src={NoAvatarImg} alt="Photo profile"/>
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
