import React from 'react';
import PropTypes from 'prop-types';
import SkeletonString from '../Skeleton/SkeletonString';
import { useTranslation } from 'react-i18next';
import style from './Profile.module.scss';

const ProfileStats = ({ profile, isMobile, loading, onDialogFollowers, onDialogFollowing }) => {
  const { t } = useTranslation();

  return (
    <ul className={`${style.ProfileInfo} ${isMobile && style.ProfileInfoMobile}`}>
      <li className={style.ProfileInfoStat}>
        { profile && !loading ?
          <span>
            <span className={style.Count}>{ profile.postsCount }</span>
            <span>&nbsp;{ t('Publications') }</span>
          </span> : <SkeletonString height={16} width={100} />
        }
      </li>
      <li className={style.ProfileInfoStat} onClick={onDialogFollowers}>
        { profile && !loading ?
          <span>
            <span className={style.Count}>{ profile.followersCount }</span>
            <span>&nbsp;{ t('Followers') }</span>
          </span> : <SkeletonString height={16} width={100} />
        }
      </li>
      <li className={style.ProfileInfoStat} onClick={onDialogFollowing}>
        { profile && !loading ?
          <span>
            <span className={style.Count}>{ profile.followingCount }</span>
            <span>&nbsp;{ t('Following') }</span>
          </span> : <SkeletonString height={16} width={100} />
        }
      </li>
    </ul>
  )
};

ProfileStats.propTypes = {
  isMobile: PropTypes.bool,
  loading: PropTypes.bool,
  onDialogFollowers: PropTypes.func.isRequired,
  onDialogFollowing: PropTypes.func.isRequired
};

export default ProfileStats;

