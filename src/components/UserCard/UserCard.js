import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import style from './UserCard.module.scss';
import { Button, Image } from '../UI';
import { useTranslation } from 'react-i18next';
import NoAvatarImg from '../../assets/noAvatar.jpg';
import { useMutation } from '@apollo/react-hooks';
import { CANCEL_FOLLOW, FOLLOW, REQUEST_FOLLOW, UNFOLLOW } from '../../routes/Profile/ProfileQuery';

const UserCard = ({ id, avatar, username, fullName, isPrivate, isFollowing, itsMe, isRequestingSubscription, customButton, small }) => {
  const { t } = useTranslation();
  const [following, setFollowing] = useState(isFollowing);
  const [requestingSubscription, setRequestingSubscription] = useState(isRequestingSubscription);
  const [follow, { loading: followLoading }] = useMutation(FOLLOW);
  const [unfollow, { loading: unfollowLoading }] = useMutation(UNFOLLOW);
  const [requestFollow, { loading: requestFollowLoading }] = useMutation(REQUEST_FOLLOW);
  const [cancelFollow, { loading: cancelFollowLoading }] = useMutation(CANCEL_FOLLOW);

  const handleFollowClick = () => {
    if (isPrivate) {
      requestFollow({
        variables: {
          subscriberId: id
        },
        update: (_, result) => {
          const { data: { requestFollow } } = result;
          if (requestFollow) {
            setRequestingSubscription(true);
          }
        }
      })
    } else {
      follow({
        variables: {
          id
        },
        update: (_, result) => {
          const { data: { follow } } = result;
          if (follow) {
            setFollowing(true);
          }
        }
      })
    }
  };

  const handleUnFollowClick = () => {
    unfollow({
      variables: {
        id
      },
      update: (_, result) => {
        const { data: { unfollow } } = result;
        if (unfollow) {
          setFollowing(false);
        }
      }
    })
  };

  const handleCancelFollowClick = () => {
    cancelFollow({
      variables: {
        subscriberId: id
      },
      update: (_, result) => {
        const { data: { cancelFollow } } = result;
        if (cancelFollow) {
          setRequestingSubscription(false)
        }
      }
    })
  };

  return (
    <div className={`${style.Container} ${small ? style.small : null}`}>
      <div className={style.Avatar}>
        <Link to={`/${username}`}>
          <Image src={avatar || NoAvatarImg} alt={`Avatar ${username}`} />
        </Link>
      </div>
      <div className={style.UserInfo}>
        <div>
          <Link to={`/${username}`}>
            {username}
          </Link>
        </div>
        <div>
          <span>{ fullName }</span>
        </div>
      </div>
      { !itsMe && !customButton &&
        <div className={style.Button}>
          { following
            ? <Button
              label={t('Unfollow')}
              type="secondary"
              disabled={unfollowLoading}
              onClick={handleUnFollowClick}
              small={small}
            />
            : requestingSubscription
              ? <Button
                label={t('Request send')}
                type="secondary"
                disabled={cancelFollowLoading}
                className={style.ProfileEdit}
                onClick={handleCancelFollowClick}
                small={small}
              />
              : <Button
                label={t('Follow')}
                disabled={followLoading || requestFollowLoading}
                onClick={handleFollowClick}
                small={small}
              />
          }
        </div>
      }
      { customButton && <div className={style.Button}>{ customButton }</div> }
    </div>
  )
};

UserCard.propTypes = {
  id: PropTypes.string.isRequired,
  avatar: PropTypes.string,
  fullName: PropTypes.string,
  username: PropTypes.string.isRequired,
  isFollowing: PropTypes.bool,
  itsMe: PropTypes.bool,
  isRequestingSubscription: PropTypes.bool,
  isPrivate: PropTypes.bool,
  small: PropTypes.bool,
  customButton: PropTypes.node
};

export default UserCard;
