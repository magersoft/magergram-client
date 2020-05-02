import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import style from './NewMessageListener.module.scss';
import SkeletonString from '../Skeleton/SkeletonString';
import NoAvatarImg from '../../assets/noAvatar.jpg';
import { Image } from '../UI';
import { useHistory, useLocation } from 'react-router';
import SkeletonAvatar from '../Skeleton/SkeletonAvatar';

const NewMessageListener = ({ active, message, onClose }) => {
  const history = useHistory();
  const location = useLocation();

  const handleToastClick = () => {
    history.push(`/direct/t/${message.room.id}`);
    onClose();
  }

  useEffect(() => {
    if (message) {
      const roomId = location.pathname.replace('/direct/t/', '');
      if (roomId === message.room.id) {
        onClose();
        return () => {
          onClose();
        }
      }
    }

    const timeout = setTimeout(() => {
      onClose();
    }, 5000);

    return () => {
      clearTimeout(timeout);
    }
  }, [active, message]);

  return (
    <div className={cx(style.Toast, active && style.active)} onClick={handleToastClick}>
      <div className={style.Container}>
        <div className={style.Avatar}>
          <div className={style.AvatarImg}>
            { message
              ? <Image src={message.from.avatar || NoAvatarImg} alt={`Avatar ${message.from.username}`} />
              : <SkeletonAvatar width={30} height={30} />
            }
          </div>
          <span className={style.Username}>{ message
            ? message.from.username
            : <SkeletonString height={14} width={60} /> }
          </span>
        </div>
        <div className={style.Message}>
          <span className={style.Text}>{ message
            ? message.text
            : <SkeletonString height={14} width={100} />}
          </span>
        </div>
      </div>
    </div>
  )
}

NewMessageListener.propTypes = {
  active: PropTypes.bool.isRequired,
  message: PropTypes.object
}

export default NewMessageListener;
