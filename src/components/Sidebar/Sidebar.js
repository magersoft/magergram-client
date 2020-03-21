import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApolloClient } from '@apollo/react-hooks';
import { MY_PROFILE } from '../Header/HeaderQueries';
import { Image } from '../UI';
import SkeletonAvatar from '../Skeleton/SkeletonAvatar';
import style from './Sidebar.module.scss';
import SkeletonString from '../Skeleton/SkeletonString';

export default ({ leftFixedPosition, isFeedGetted }) => {
  const client = useApolloClient();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (isFeedGetted) {
      const { myProfile } = client.cache.readQuery({ query: MY_PROFILE });
      if (myProfile) {
        setUser(myProfile);
      }
    }
  }, [isFeedGetted, client]);

  return (
    <div
      className={style.Sidebar}
      style={{ left: leftFixedPosition }}>
      <div className={style.MyProfile}>
        <div className={style.MyProfileWrapper}>
          <div className={style.Avatar}>
            { user ?
              <Link to={`/${user.username}`}>
                <Image src={user.avatar} />
              </Link>
              : <SkeletonAvatar height={50} width={50} /> }
          </div>
          <div className={style.UserInfo}>
            <div className={style.UserInfoUsername}>
              { user ? <Link to={`/${user.username}`}>{ user.username }</Link> : <SkeletonString height={14} width={100} /> }
            </div>
            <div className={style.UserInfoFullName}>
              { user ? <span>{ user.fullName }</span> : <SkeletonString height={14} width={100} /> }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
