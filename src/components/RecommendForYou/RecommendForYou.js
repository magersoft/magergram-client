import React, { useEffect, useState } from 'react';
import style from './RecommendForYou.module.scss'
import { useTranslation } from 'react-i18next';
import UserCard from '../UserCard';
import { useQuery } from '@apollo/react-hooks';
import { RECOMMEND_USERS } from './RecommendForYouQueries';
import UserCardSkeleton from '../UserCard/UserCardSkeleton';
import EmptyPosts from '../EmptyPosts';

export default ({ isExistPosts, onLoading }) => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const { data, loading } = useQuery(RECOMMEND_USERS, { skip: isExistPosts, fetchPolicy: 'cache-and-network' });

  useEffect(() => {
    if (data) {
      const { recommendedUsers } = data;
      if (recommendedUsers) {
        setUsers(recommendedUsers);
        onLoading(true);
      }
    }
  }, [data, onLoading]);

  return (
    <React.Fragment>
      { !isExistPosts &&
        <section className={style.Container}>
          <h4 className={style.Title}>{ t('Recommendation for You') }</h4>
          <div className={style.Wrapper}>
            <div className={style.RecommendedUsers}>
              { users && users.map(user => {
                const { id, username, avatar, fullName, isFollowing, isSelf, isPrivate, isRequestingSubscription } = user;
                return <UserCard
                  avatar={avatar}
                  id={id}
                  username={username}
                  fullName={fullName}
                  itsMe={isSelf}
                  isPrivate={isPrivate}
                  isFollowing={isFollowing}
                  isRequestingSubscription={isRequestingSubscription}
                  key={id}
                />
              }) }
              { loading &&
              <React.Fragment>
                <UserCardSkeleton />
                <UserCardSkeleton />
                <UserCardSkeleton />
                <UserCardSkeleton />
                <UserCardSkeleton />
              </React.Fragment>
              }
              { !loading && !users.length && <EmptyPosts /> }
            </div>
          </div>
        </section>
      }
    </React.Fragment>
  )
}
