import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Route, Switch, NavLink } from 'react-router-dom';
import Helmet from 'react-helmet';
import style from './EditProfile.module.scss';
import { useTranslation } from 'react-i18next';
import Spinner from '../../components/Loader/Spinner';
import { useQuery } from '@apollo/react-hooks';
import { MY_PROFILE } from '../../components/Header/HeaderQueries';
import { CloseIcon } from '../../components/Icon';

const Edit = lazy(() => import('./pages/Edit'));
const ChangePassword = lazy(() => import('./pages/ChangePassword'));
const PushNotification = lazy(() => import('./pages/PushNotification'));
const ConfidentialSecurity = lazy(() => import('./pages/ConfidentialSecurity'));
const ApplicationSettings = lazy(() => import('./pages/ApplicationSettings'));

export default () => {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [isOpenMenu, setOpenMenu] = useState(false);

  const { data, loading } = useQuery(MY_PROFILE);
  useEffect(() => {
    if (data) {
      const { myProfile } = data;
      if (myProfile) {
        setUser(myProfile);
      }
    }
  }, [data]);

  const menu = [
    { name: t('Edit profile'), link: '/edit-profile' },
    { name: t('Change password'), link: '/edit-profile/password' },
    { name: t('Push-notification'), link: '/edit-profile/push' },
    { name: t('Confidential and security'), link: '/edit-profile/security' },
    { name: t('Application settings'), link: '/edit-profile/settings' }
  ];

  const Loader = <Spinner />;

  const handleCloseMenu = () => {
    setOpenMenu(false);
  };

  return (
    <div className="container">
      <Helmet>
        <title>{ t('Edit profile') }</title>
      </Helmet>
      <div className={style.EditProfile}>
        <ul className={`${style.Menu} ${isOpenMenu ? style.open : ''}`}>
          <div className={style.CloseIcon} onClick={handleCloseMenu}>
            <CloseIcon width={25} height={25} />
          </div>
          { menu.map(item => <li key={item.link}><NavLink exact to={item.link} onClick={handleCloseMenu}>{ item.name }</NavLink></li>) }
        </ul>
        { user && !loading &&
        <article className={style.Content}>
          <Suspense fallback={Loader}>
            <Switch>
              <Route path="/edit-profile" exact={true} render={() => <Edit user={user} setUser={setUser} />} />
              <Route path="/edit-profile/password" render={() => <ChangePassword user={user} />} />
              <Route path="/edit-profile/push" component={PushNotification} />
              <Route path="/edit-profile/security" component={ConfidentialSecurity} />
              <Route path="/edit-profile/settings" component={ApplicationSettings} />
            </Switch>
          </Suspense>
        </article>
        }
        <div className={style.MenuTrigger} onClick={() => setOpenMenu(true)}>
          <button>
            <span />
            <span />
            <span />
          </button>
          <div className={style.MenuLabel}>
            <span>{ t('Settings') }</span>
          </div>
        </div>
        { isOpenMenu && <div className={style.Overlay} onClick={handleCloseMenu} /> }
      </div>
    </div>
  )
}
