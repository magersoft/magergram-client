import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Route, Switch, NavLink } from 'react-router-dom';
import Helmet from 'react-helmet';
import style from './EditProfile.module.scss';
import { useTranslation } from 'react-i18next';
import Spinner from '../../components/Loader/Spinner';
import { useQuery } from '@apollo/react-hooks';
import { MY_PROFILE } from '../../components/Header/HeaderQueries';

const Edit = lazy(() => import('./pages/Edit'));
const ChangePassword = lazy(() => import('./pages/ChangePassword'));
const PushNotification = lazy(() => import('./pages/PushNotification'));
const ConfidentialSecurity = lazy(() => import('./pages/ConfidentialSecurity'));

export default () => {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);

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
    { name: t('Confidential and security'), link: '/edit-profile/security' }
  ];

  const Loader = <Spinner />;

  return (
    <div className="container">
      <Helmet>
        <title>{ t('Edit profile') }</title>
      </Helmet>
      <div className={style.EditProfile}>
        <ul className={style.Menu}>
          { menu.map(item => <li key={item.link}><NavLink exact to={item.link}>{ item.name }</NavLink></li>) }
        </ul>
        { user && !loading &&
        <article className={style.Content}>
          <Suspense fallback={Loader}>
            <Switch>
              <Route path="/edit-profile" exact={true} render={() => <Edit user={user} setUser={setUser} />} />
              <Route path="/edit-profile/password" component={ChangePassword} />
              <Route path="/edit-profile/push" component={PushNotification} />
              <Route path="/edit-profile/security" component={ConfidentialSecurity} />
            </Switch>
          </Suspense>
        </article>
        }
      </div>
    </div>
  )
}
