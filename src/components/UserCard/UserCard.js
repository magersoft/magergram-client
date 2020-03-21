import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import style from './UserCard.module.scss';
import { Button, Image } from '../UI';
import { useTranslation } from 'react-i18next';
import NoAvatarImg from '../../assets/noAvatar.jpg';
import { useMutation } from '@apollo/react-hooks';
import { FOLLOW, UNFOLLOW } from '../../routes/Profile/ProfileQuery';

const UserCard = ({ id, avatar, username, fullName, isFollowing, small }) => {
  const { t } = useTranslation();
  const [following, setFollowing] = useState(isFollowing);
  const [follow, { loading: followLoading }] = useMutation(FOLLOW);
  const [unfollow, { loading: unfollowLoading }] = useMutation(UNFOLLOW);

  const handleFollowClick = () => {
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

  return (
    <div className={`${style.Container} ${small && style.small}`}>
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
      <div className={style.Button}>
        { following ?
          <Button
            label={t('Unfollow')}
            type="secondary"
            disabled={unfollowLoading}
            onClick={handleUnFollowClick}
            small={small}
          />
          :
          <Button
            label={t('Follow')}
            disabled={followLoading}
            onClick={handleFollowClick}
            small={small}
          />
        }
      </div>
    </div>
  )
};

UserCard.propTypes = {
  id: PropTypes.string.isRequired,
  avatar: PropTypes.string,
  fullName: PropTypes.string,
  username: PropTypes.string.isRequired,
  isFollowing: PropTypes.bool,
  small: PropTypes.bool
};

export default UserCard;
