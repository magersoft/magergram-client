import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import style from './Activity.module.scss';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { CONFIRM_FOLLOW, SEE_NOTIFICATIONS } from './ActivityQueries';
import Spinner from '../Loader/Spinner';
import { Button, Image } from '../UI';
import NoAvatarImg from '../../assets/noAvatar.jpg';
import { useTranslation } from 'react-i18next';

const Activity = ({ show, onClose }) => {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState([]);

  const [seeNotifications, { loading, data }] = useLazyQuery(SEE_NOTIFICATIONS);

  useEffect(() => {
    if (show) {
      seeNotifications()
    }
  }, [show, seeNotifications]);

  useEffect(() => {
    if (data) {
      const { seeNotifications } = data;
      setNotifications(seeNotifications)
    }
  }, [data]);

  const [confirmFollow, { loading: loadingConfirmFollow }] = useMutation(CONFIRM_FOLLOW);

  const handleConfirm = (notificationId, requestUserId) => {
    confirmFollow({
      variables: {
        notificationId,
        requestUserId
      },
      update: (_, result) => {
        const { data: { confirmFollow } } = result;
        if (confirmFollow) {
          setNotifications(notifications.filter(n => n.id !== confirmFollow.id))
        }
      }
    })
  };

  return (
    <React.Fragment>
      { show && <div className={style.Overlay} onClick={onClose} /> }
      <div className={`${style.Container} ${show ? style.active : ''}`}>
        <h1 className={style.Title}>{ t('Activity') }</h1>
        {
          notifications.length ?
          notifications.map(notification => {
            const { subscriber } = notification;
            return (
              <div className={style.Card} key={notification.id}>
                <div className={style.Avatar}>
                  <Link to={`/${subscriber.username}`}>
                    <Image src={subscriber.avatar || NoAvatarImg} alt={`Avatar ${subscriber.username}`} />
                  </Link>
                </div>
                <div className={style.Info}>
                  <Link to={`/${subscriber.username}`}>
                    <span className={style.Username}>{ subscriber.username }</span>
                  </Link>
                  { notification.type === 'SUBSCRIPTION' && notification.requesting &&
                    <span>{ t('send request on subscription') }</span>
                  }
                  { notification.type === 'CONFIRM' && !notification.requesting &&
                    <span>{ t('accepted your request') }</span>
                  }
                </div>
                <div className={style.Action}>
                  { notification.type === 'SUBSCRIPTION' &&
                    <Button
                      label={t('Confirm')}
                      type="secondary"
                      disabled={loadingConfirmFollow}
                      onClick={() => handleConfirm(notification.id, subscriber.id)}
                    />
                  }
                </div>
              </div>
            )
          }) :
          loading ? <Spinner /> : <div className={style.NotNotification}>{t('No notifications')}</div>
        }
    </div>
    </React.Fragment>
  )
};

export default Activity;
