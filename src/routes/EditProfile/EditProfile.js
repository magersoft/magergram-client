import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Route, Switch, NavLink } from 'react-router-dom';
import Helmet from 'react-helmet';
import style from './EditProfile.module.scss';
import { useTranslation } from 'react-i18next';
import Spinner from '../../components/Loader/Spinner';
import { useQuery } from '@apollo/react-hooks';
import { MY_PROFILE } from '../../layout/Main/MainQueries';
import { BackIcon } from '../../components/Icon';
import AppHeader from '../../components/AppHeader';

const Edit = lazy(() => import('./pages/Edit'));
const ChangePassword = lazy(() => import('./pages/ChangePassword'));
const PushNotification = lazy(() => import('./pages/PushNotification'));
const ConfidentialSecurity = lazy(() => import('./pages/ConfidentialSecurity'));
const ApplicationSettings = lazy(() => import('./pages/ApplicationSettings'));

export default ({ history }) => {
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
    { name: t('Notifications'), link: '/edit-profile/notification' },
    { name: t('Confidential and security'), link: '/edit-profile/security' },
    { name: t('Application settings'), link: '/edit-profile/settings' }
  ];

  const Loader = <div className={style.Loader}><Spinner width={60} height={60} /></div>;

  const handleCloseMenu = () => {
    setOpenMenu(false);
  };

  return (
    <React.Fragment>
      <AppHeader
        title={t('Edit profile')}
        leftButton={user &&
          <button className={style.Back} onClick={() => history.push(`/${user.username}`)}>
            <BackIcon width={24} height={24} color="var(--color-main)" />
          </button>
        }
        rightButton={
          <div className={style.MenuTrigger} onClick={() => setOpenMenu(true)}>
            <button>
              <span />
              <span />
              <span />
            </button>
          </div>
        }
      />
      <div className="container">
      <Helmet>
        <title>{ t('Edit profile') }</title>
      </Helmet>
      <div className={style.EditProfile}>
        <ul className={`${style.Menu} ${isOpenMenu ? style.open : ''}`}>
          { menu.map(item => <li key={item.link}><NavLink exact to={item.link} onClick={handleCloseMenu}>{ item.name }</NavLink></li>) }
        </ul>
        { user && !loading &&
        <article className={style.Content}>
          <Suspense fallback={Loader}>
            <Switch>
              <Route path="/edit-profile" exact={true} render={() => <Edit user={user} setUser={setUser} />} />
              <Route path="/edit-profile/password" render={() => <ChangePassword user={user} />} />
              <Route path="/edit-profile/notification" render={() => <PushNotification user={user} />} />
              <Route path="/edit-profile/security" render={() => <ConfidentialSecurity user={user} />} />
              <Route path="/edit-profile/settings" render={() => <ApplicationSettings user={user} />} />
            </Switch>
          </Suspense>
        </article>
        }
        { isOpenMenu && <div className={style.Overlay} onClick={handleCloseMenu} /> }
      </div>
    </div>
    </React.Fragment>
  )
}
