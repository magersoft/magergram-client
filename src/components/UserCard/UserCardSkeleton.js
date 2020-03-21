import React from 'react';
import ButtonSkeleton from '../UI/Button/ButtonSkeleton';
import SkeletonString from '../Skeleton/SkeletonString';
import SkeletonAvatar from '../Skeleton/SkeletonAvatar';
import style from './UserCard.module.scss'

export default ({ small }) => (
  <div className={`${style.Skeleton} ${style.Container} ${small && style.small}`}>
    <SkeletonAvatar width={44} height={44} className={style.SkeletonAvatar} />
    <div className={style.UserInfo}>
      <SkeletonString width={130} height={14} />
    </div>
    { !small &&
    <div className={style.Button}>
      <ButtonSkeleton width={110} />
    </div>
    }
  </div>
);
