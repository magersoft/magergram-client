import React, { useEffect, useState } from 'react';
import style from './Activity.module.scss';
import { useQuery } from '@apollo/react-hooks';
import { SEE_NOTIFICATIONS } from './ActivityQueries';
import { useTranslation } from 'react-i18next';
import NotificationCard from '../../components/NotificationCard';
import UserCardSkeleton from '../../components/UserCard/UserCardSkeleton';

export default () => {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState([]);

  const { data, loading } = useQuery(SEE_NOTIFICATIONS);

  useEffect(() => {
    if (data) {
      const { seeNotifications } = data;
      setNotifications(seeNotifications);
    }
  }, [data]);

  const handleUpdateNotification = id => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  }

  return (
    <div className={style.Container}>
      <header className={style.Header}>
        <h1 className={style.Title}>{t('Activity')}</h1>
      </header>
      <div className={style.Notifications}>
        { notifications.length ?
          notifications.map(notification => {
            const { id, createdAt, subscriber, post, type } = notification;
            return (
              <NotificationCard
                id={id}
                key={id}
                post={post}
                type={type}
                createdAt={createdAt}
                subscriber={subscriber}
                updateNotification={handleUpdateNotification}
              />
            )
          })
          : loading
            ? [...Array(10).keys()].map(idx => <UserCardSkeleton key={idx} />)
            : <div className={style.NotNotification}>{t('No notifications')}</div>
        }
      </div>
    </div>
  )
};
