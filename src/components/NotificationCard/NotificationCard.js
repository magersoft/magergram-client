import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import style from './NotificationCard.module.scss';
import NoAvatarImg from '../../assets/noAvatar.jpg';
import { Button, Image } from '../UI';
import timeAgo from '../../utils/timeAgo';
import { useMutation } from '@apollo/react-hooks';
import { CONFIRM_FOLLOW } from '../../routes/Activity/ActivityQueries';
import { useTranslation } from 'react-i18next';

const NotificationCard = ({ id, type, requesting, subscriber, post, createdAt, updateNotification, onClose }) => {
  const { t } = useTranslation();

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
          updateNotification(confirmFollow.id);
        }
      }
    })
  }

  return (
    <div className={style.Card}>
      <div className={style.Avatar}>
        <Link to={`/${subscriber.username}`} onClick={onClose}>
          <Image src={subscriber.avatar || NoAvatarImg} alt={`Avatar ${subscriber.username}`} />
        </Link>
      </div>
      <div className={style.Info}>
        <Link to={`/${subscriber.username}`} onClick={onClose}>
          <span className={style.Username}>{ subscriber.username }</span>
        </Link>
        { type === 'SUBSCRIPTION' && requesting && <span>{ t('send request on subscription') }</span> }
        { type === 'SUBSCRIPTION' && !requesting && <span>{ t('started following you') }</span> }
        { type === 'CONFIRM' && !requesting && <span>{ t('accepted your request') }</span> }
        { type === 'LIKE' && <span>{ t('put your photo like') }</span> }
        { type === 'COMMENT' && <span>{ t('commented your photo') }</span> }
        <div className={style.Ago}>
          <span>{ timeAgo.format(new Date(createdAt)) }</span>
        </div>
      </div>
      <div className={style.Action}>
        { type === 'SUBSCRIPTION' && requesting &&
        <Button
          label={t('Confirm')}
          type="secondary"
          disabled={loadingConfirmFollow}
          onClick={() => handleConfirm(id, subscriber.id)}
        />
        }
        { (type === 'LIKE' || type === 'COMMENT') &&
        <div className={style.MiniPost} onClick={onClose}>
          <Link to={`/post/${post.id}`}>
            <Image src={post.files[0].url} />
          </Link>
        </div>
        }
      </div>
    </div>
  )
};

NotificationCard.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['LIKE', 'COMMENT', 'SUBSCRIPTION', 'CONFIRM']).isRequired,
  requesting: PropTypes.bool,
  subscriber: PropTypes.object.isRequired,
  post: PropTypes.object,
  createdAt: PropTypes.string.isRequired,
  updateNotification: PropTypes.func.isRequired,
  onClose: PropTypes.func
};

export default NotificationCard;
