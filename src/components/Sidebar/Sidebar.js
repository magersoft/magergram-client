import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApolloClient, useQuery } from '@apollo/react-hooks';
import { MY_PROFILE } from '../Header/HeaderQueries';
import { Image } from '../UI';
import SkeletonAvatar from '../Skeleton/SkeletonAvatar';
import style from './Sidebar.module.scss';
import SkeletonString from '../Skeleton/SkeletonString';
import { useTranslation } from 'react-i18next';
import { RECOMMEND_USERS } from '../RecommendForYou/RecommendForYouQueries';
import UserCard from '../UserCard';
import UserCardSkeleton from '../UserCard/UserCardSkeleton';
import NoAvatarImg from '../../assets/noAvatar.jpg';

export default ({ leftFixedPosition, isFeedGetted }) => {
  const { t } = useTranslation();
  const client = useApolloClient();
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (isFeedGetted) {
      const { myProfile } = client.cache.readQuery({ query: MY_PROFILE });
      if (myProfile) {
        setUser(myProfile);
      }
    }
  }, [isFeedGetted, client]);

  const { data, loading } = useQuery(RECOMMEND_USERS, { fetchPolicy: 'network-only' });

  useEffect(() => {
    if (data) {
      const { recommendedUsers } = data;
      if (recommendedUsers) {
        setUsers(recommendedUsers);
      }
    }
  }, [data]);

  return (
    <div
      className={style.Sidebar}
      style={{ left: leftFixedPosition }}>
      <div className={style.MyProfile}>
        <div className={style.MyProfileWrapper}>
          <div className={style.Avatar}>
            { user ?
              <Link to={`/${user.username}`}>
                <Image src={user.avatar || NoAvatarImg} />
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
      <div className={style.RecommendedBlock}>
        <h4>{ t('Recommendation for You') }</h4>
        <div className={style.RecommendedBlockWrapper}>
          { users.map(user => {
            const { id, username, avatar, fullName, isFollowing } = user;
            return <UserCard
              avatar={avatar}
              id={id}
              username={username}
              fullName={fullName}
              isFollowing={isFollowing}
              key={id}
              small
            />
          }) }
          { loading &&
          <React.Fragment>
            <UserCardSkeleton small />
            <UserCardSkeleton small />
            <UserCardSkeleton small />
            <UserCardSkeleton small />
            <UserCardSkeleton small />
          </React.Fragment>
          }
          { !loading && !users.length && <span className={style.NoRecommend}>{ t('No recommendation') }</span> }
        </div>
      </div>
      <div className={style.About}>
        <nav className={style.Nav}>
          <ul>
            <li>
              <a href="https://github.com/magersoft">GitHub</a>
            </li>
            <li>
              <a href="https://github.com/magersoft/magergram-api">API</a>
            </li>
            <li>
              <a href="https://github.com/magersoft/magergram-client">{t('Client')}</a>
            </li>
            <li>
              <a href="https://github.com/magersoft/magergrap-app">{t('Mobile Application')}</a>
            </li>
          </ul>
        </nav>
        <span className={style.Copyright}>
          © MAGERGRAM { t('from') } MAGERSOFT, { new Date().getFullYear() }
        </span>
      </div>
    </div>
  )
}
