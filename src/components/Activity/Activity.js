import React, { useEffect, useState } from 'react';
import style from './Activity.module.scss';
import { useQuery} from '@apollo/react-hooks';
import { SEE_NOTIFICATIONS } from '../../routes/Activity/ActivityQueries';
import Spinner from '../Loader/Spinner';
import { useTranslation } from 'react-i18next';
import NotificationCard from '../NotificationCard';

const Activity = ({ show, onClose }) => {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState([]);

  const { loading, data } = useQuery(SEE_NOTIFICATIONS);

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
    <React.Fragment>
      { show && <div className={style.Overlay} onClick={onClose} /> }
      <div className={`${style.Container} ${show ? style.active : ''}`}>
        {
          notifications.length ?
          notifications.map(notification => {
            const { id, createdAt, subscriber, post, type } = notification;
            return (
              <NotificationCard
                id={id}
                key={id}
                type={type}
                subscriber={subscriber}
                post={post}
                createdAt={createdAt}
                updateNotification={handleUpdateNotification}
                onClose={onClose}
              />
            )
          }) :
          loading ? <Spinner /> : <div className={style.NotNotification}>{t('No notifications')}</div>
        }
    </div>
    </React.Fragment>
  )
};

export default Activity;
