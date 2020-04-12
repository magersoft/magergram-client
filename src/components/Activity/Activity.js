import React, { useEffect, useRef, useState } from 'react';
import style from './Activity.module.scss';
import { useQuery} from '@apollo/react-hooks';
import { SEE_NOTIFICATIONS } from '../../routes/Activity/ActivityQueries';
import Spinner from '../Loader/Spinner';
import { useTranslation } from 'react-i18next';
import NotificationCard from '../NotificationCard';
import InfiniteScroll from 'react-infinite-scroller';

const PER_PAGE_NOTIFICATIONS = 6;

const Activity = ({ show, onClose }) => {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState([]);
  const [noMoreNotifications, setNoMoreNotifications] = useState(false);

  const scrollParentRef = useRef();

  const { loading, data, fetchMore } = useQuery(SEE_NOTIFICATIONS, {
    variables: {
      perPage: PER_PAGE_NOTIFICATIONS,
      page: 0
    },
    fetchPolicy: 'network-only'
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
    <React.Fragment>
      { show && <div className={style.Overlay} onClick={onClose} /> }
      <div className={`${style.Container} ${show ? style.active : ''}`} ref={scrollParentRef}>
        {
          notifications.length
            ? <InfiniteScroll
                pageStart={0}
                loadMore={handleFetchMore}
                hasMore={!noMoreNotifications}
                initialLoad={false}
                className={style.Wrapper}
                useWindow={false}
                getScrollParent={() => scrollParentRef.current}
                loader={
                  <div key={0} className={style.MoreLoading}>
                    { notifications.length ? <Spinner width={40} height={40} /> : null }
                  </div>
                }
              >
              { notifications.map(notification => {
                const {id, createdAt, subscriber, post, type} = notification;
                return (
                  <NotificationCard
                    id={id}
                    key={id}
                    type={type}
                    subscriber={subscriber}
                    post={post}
                    createdAt={createdAt}
                    updateNotification={handleUpdateNotification}
                    onClose={onClose}
                  />
                )
              }) }
            </InfiniteScroll>
            : loading
              ? <Spinner />
              : <div className={style.NotNotification}>{t('No notifications')}</div>
        }
    </div>
    </React.Fragment>
  )
};

export default Activity;
