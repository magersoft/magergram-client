import React, { useEffect, useState } from 'react';
import style from './Activity.module.scss';
import { useQuery } from '@apollo/react-hooks';
import { SEE_NOTIFICATIONS } from './ActivityQueries';
import { useTranslation } from 'react-i18next';
import NotificationCard from '../../components/NotificationCard';
import UserCardSkeleton from '../../components/UserCard/UserCardSkeleton';
import InfiniteScroll from 'react-infinite-scroller';
import Spinner from '../../components/Loader/Spinner';
import AppHeader from '../../components/AppHeader';

const PER_PAGE_NOTIFICATIONS = 10;

export default () => {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState([]);
  const [noMoreNotifications, setNoMoreNotifications] = useState(false);

  const { data, loading, fetchMore } = useQuery(SEE_NOTIFICATIONS, {
    variables: {
      perPage: PER_PAGE_NOTIFICATIONS,
      page: 0
    },
    fetchPolicy: 'cache-and-network'
  });

  useEffect(() => {
    if (data) {
      const { seeNotifications } = data;
      setNotifications(seeNotifications);
    }
  }, [data]);

  const handleUpdateNotification = id => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  }

  const handleFetchMore = async page => {
    try {
      await fetchMore({
        variables: {
          perPage: PER_PAGE_NOTIFICATIONS,
          page
        },
        updateQuery: (prevResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) {
            return prevResult;
          }
          if (!fetchMoreResult.seeNotifications.length) {
            setNoMoreNotifications(true);
          }
          return {
            ...prevResult,
            seeNotifications: [ ...prevResult.seeNotifications, ...fetchMoreResult.seeNotifications ]
          }
        }
      })
    } catch {}
  }

  return (
    <div className={style.Container}>
      <AppHeader title={t('Activity')} />
      <div className={style.Notifications}>
        { notifications.length
          ? <InfiniteScroll
              pageStart={0}
              loadMore={handleFetchMore}
              hasMore={!noMoreNotifications}
              initialLoad={false}
              loader={
                <div key={0} className={style.MoreLoading}>
                  { notifications.length ? <Spinner width={40} height={40} /> : null }
                </div>
              }
            >
            { notifications.map(notification => {
              const { id, createdAt, subscriber, post, type, requesting } = notification;
              return (
                <NotificationCard
                  id={id}
                  key={id}
                  post={post}
                  type={type}
                  requesting={requesting}
                  createdAt={createdAt}
                  subscriber={subscriber}
                  updateNotification={handleUpdateNotification}
                />
              )
            }) }
            </InfiniteScroll>
          : loading
            ? [...Array(15).keys()].map(idx => <UserCardSkeleton key={idx} />)
            : <div className={style.NotNotification}>{t('No notifications')}</div>
        }
      </div>
    </div>
  )
};
